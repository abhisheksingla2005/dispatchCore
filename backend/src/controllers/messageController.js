/**
 * Message Controller
 *
 * Handles 1-on-1 chat messaging between pairs of participants.
 * Each conversation is scoped to a specific order + channel.
 *
 * Channels (always sorted alphabetically):
 *   dispatcher-driver     — dispatcher ↔ driver
 *   dispatcher-recipient  — dispatcher ↔ recipient
 *   driver-recipient      — driver ↔ recipient
 */

const { Op, fn, col, literal } = require('sequelize');
const { Message, Order, Assignment, Driver, Company } = require('../models');
const { success } = require('../utils/response');
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors');

// ── Helpers ──

/**
 * Derive the channel name from two role types.
 * Channel names are always alphabetically sorted: "dispatcher-driver", etc.
 */
function deriveChannel(roleA, roleB) {
  const sorted = [roleA, roleB].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

/**
 * Get the "other" role in a channel for the given role.
 */
function otherRole(channel, myRole) {
  const parts = channel.split('-');
  return parts.find((p) => p !== myRole) || parts[1];
}

/**
 * Build participant info from pre-loaded order data.
 * Expects order to have company and assignment eager-loaded.
 */
function getOrderParticipants(order, company, assignment) {
  const participants = {};

  if (company) {
    participants.dispatcher = {
      type: 'dispatcher',
      id: company.id,
      name: company.name || company.email,
    };
  }

  if (assignment && assignment.driver) {
    participants.driver = {
      type: 'driver',
      id: assignment.driver.id,
      name: assignment.driver.name || `Driver #${assignment.driver.id}`,
    };
  }

  if (order.recipient_name || order.recipient_phone || order.recipient_email) {
    participants.recipient = {
      type: 'recipient',
      id: null,
      name: order.recipient_name || 'Recipient',
      phone: order.recipient_phone,
      email: order.recipient_email,
    };
  }

  return participants;
}

// ── Get conversations (grouped by order+channel) ──

/**
 * GET /api/messages/conversations
 *
 * Query: role, tracking_code (for recipient)
 * Returns list of 1-on-1 chat threads.
 */
const getConversations = async (req, res, next) => {
  try {
    const { role } = req.query;

    let orders;
    const eagerIncludes = [
      { model: Company, as: 'company', attributes: ['id', 'name', 'email'] },
      {
        model: Assignment,
        as: 'assignment',
        required: false,
        include: [{ model: Driver, as: 'driver', attributes: ['id', 'name', 'email', 'phone'] }],
      },
    ];

    if (role === 'dispatcher') {
      const companyId = req.headers['x-company-id'];
      if (!companyId) throw new ValidationError('x-company-id header required');
      orders = await Order.findAll({
        where: { company_id: companyId },
        include: eagerIncludes,
        order: [['updated_at', 'DESC']],
      });
    } else if (role === 'driver') {
      const driverId = req.headers['x-driver-id'];
      if (!driverId) throw new ValidationError('x-driver-id header required');
      const assignments = await Assignment.findAll({
        where: { driver_id: driverId },
        include: [
          {
            model: Order,
            as: 'order',
            include: eagerIncludes,
          },
        ],
        order: [['created_at', 'DESC']],
      });
      orders = assignments.map((a) => a.order).filter(Boolean);
    } else if (role === 'recipient') {
      const { tracking_code } = req.query;
      if (!tracking_code) throw new ValidationError('tracking_code required for recipient');
      const order = await Order.findOne({
        where: { tracking_code },
        include: eagerIncludes,
      });
      orders = order ? [order] : [];
    } else {
      throw new ValidationError('role must be dispatcher, driver, or recipient');
    }

    // Batch-fetch message stats for all order IDs
    const orderIds = orders.map((o) => o.id);
    if (orderIds.length === 0) return success(res, []);

    // Get message counts + last message per order+channel in bulk
    const messageCounts = await Message.findAll({
      where: { order_id: { [Op.in]: orderIds } },
      attributes: ['order_id', 'channel', [fn('COUNT', col('id')), 'total']],
      group: ['order_id', 'channel'],
      raw: true,
    });

    const unreadCounts = await Message.findAll({
      where: {
        order_id: { [Op.in]: orderIds },
        sender_type: { [Op.ne]: role },
        is_read: false,
      },
      attributes: ['order_id', 'channel', [fn('COUNT', col('id')), 'unread']],
      group: ['order_id', 'channel'],
      raw: true,
    });

    // Build lookup maps
    const countKey = (oid, ch) => `${oid}:${ch}`;
    const totalMap = new Map(messageCounts.map((r) => [countKey(r.order_id, r.channel), parseInt(r.total, 10)]));
    const unreadMap = new Map(unreadCounts.map((r) => [countKey(r.order_id, r.channel), parseInt(r.unread, 10)]));

    // Get last message per order+channel
    const allMessages = await Message.findAll({
      where: { order_id: { [Op.in]: orderIds } },
      order: [['created_at', 'DESC']],
    });
    const lastMessageMap = new Map();
    for (const m of allMessages) {
      const key = countKey(m.order_id, m.channel);
      if (!lastMessageMap.has(key)) lastMessageMap.set(key, m);
    }

    const conversations = [];

    for (const order of orders) {
      const company = order.company;
      const assignment = order.assignment;
      const participants = getOrderParticipants(order, company, assignment);

      // Determine which channels this role participates in
      const myChannels = [];
      if (role === 'dispatcher') {
        if (participants.driver) myChannels.push('dispatcher-driver');
        if (participants.recipient) myChannels.push('dispatcher-recipient');
      } else if (role === 'driver') {
        if (participants.dispatcher) myChannels.push('dispatcher-driver');
        if (participants.recipient) myChannels.push('driver-recipient');
      } else {
        // recipient
        if (participants.dispatcher) myChannels.push('dispatcher-recipient');
        if (participants.driver) myChannels.push('driver-recipient');
      }

      for (const channel of myChannels) {
        const key = countKey(order.id, channel);
        const messageCount = totalMap.get(key) || 0;
        if (messageCount === 0) continue;

        const other = otherRole(channel, role);
        const otherParticipant = participants[other];
        const lastMessage = lastMessageMap.get(key);
        const unreadCount = unreadMap.get(key) || 0;

        conversations.push({
          orderId: order.id,
          trackingCode: order.tracking_code,
          channel,
          status: order.status,
          pickupAddress: order.pickup_address,
          deliveryAddress: order.delivery_address,
          recipientName: order.recipient_name,
          otherParticipant: otherParticipant || { type: other, id: null, name: other },
          lastMessage: lastMessage
            ? {
                text: lastMessage.text,
                senderType: lastMessage.sender_type,
                senderName: lastMessage.sender_name,
                time: lastMessage.created_at
                  ? new Date(lastMessage.created_at).toISOString()
                  : new Date().toISOString(),
              }
            : null,
          unreadCount,
        });
      }
    }

    // Sort by last message time (most recent first)
    conversations.sort((a, b) => {
      const tA = a.lastMessage?.time ? new Date(a.lastMessage.time).getTime() : 0;
      const tB = b.lastMessage?.time ? new Date(b.lastMessage.time).getTime() : 0;
      return tB - tA;
    });

    return success(res, conversations);
  } catch (err) {
    next(err);
  }
};

// ── Get messages for a specific channel ──

/**
 * GET /api/messages/:orderId/:channel
 *
 * Query: role, tracking_code (for recipient auth)
 */
const getMessages = async (req, res, next) => {
  try {
    const { orderId, channel } = req.params;
    const { role, tracking_code } = req.query;

    const validChannels = ['dispatcher-driver', 'dispatcher-recipient', 'driver-recipient'];
    if (!validChannels.includes(channel)) {
      throw new ValidationError('Invalid channel');
    }

    // Verify the role is part of this channel
    if (!channel.includes(role)) {
      throw new ForbiddenError('You are not a participant in this channel');
    }

    const order = await Order.findByPk(orderId);
    if (!order) throw new NotFoundError('Order');

    // Auth
    if (role === 'dispatcher') {
      const companyId = req.headers['x-company-id'];
      if (String(order.company_id) !== String(companyId)) {
        throw new ForbiddenError('Order does not belong to your company');
      }
    } else if (role === 'driver') {
      const driverId = req.headers['x-driver-id'];
      const assignment = await Assignment.findOne({
        where: { order_id: orderId, driver_id: driverId },
      });
      if (!assignment) throw new ForbiddenError('Not assigned to this order');
    } else if (role === 'recipient') {
      if (order.tracking_code !== tracking_code) {
        throw new ForbiddenError('Invalid tracking code');
      }
    }

    const messages = await Message.findAll({
      where: { order_id: orderId, channel },
      order: [['created_at', 'ASC']],
    });

    // Mark as read
    await Message.update(
      { is_read: true },
      { where: { order_id: orderId, channel, sender_type: { [Op.ne]: role }, is_read: false } },
    );

    const formatted = messages.map((m) => ({
      id: m.id,
      orderId: m.order_id,
      channel: m.channel,
      senderType: m.sender_type,
      senderId: m.sender_id,
      senderName: m.sender_name,
      text: m.text,
      isRead: m.is_read,
      time: m.created_at ? new Date(m.created_at).toISOString() : new Date().toISOString(),
    }));

    return success(res, formatted);
  } catch (err) {
    next(err);
  }
};

// ── Send a message ──

/**
 * POST /api/messages/:orderId/:channel
 *
 * Body: { sender_type, sender_id, sender_name, text, tracking_code? }
 */
const sendMessage = async (req, res, next) => {
  try {
    const { orderId, channel } = req.params;
    const { sender_type, sender_id, sender_name, text, tracking_code } = req.body;

    const validChannels = ['dispatcher-driver', 'dispatcher-recipient', 'driver-recipient'];
    if (!validChannels.includes(channel)) {
      throw new ValidationError('Invalid channel');
    }

    if (!channel.includes(sender_type)) {
      throw new ForbiddenError('Sender type does not match channel');
    }

    if (!sender_type || !sender_name || !text) {
      throw new ValidationError('sender_type, sender_name, and text are required');
    }

    const order = await Order.findByPk(orderId);
    if (!order) throw new NotFoundError('Order');

    // Auth
    if (sender_type === 'dispatcher') {
      const companyId = req.headers['x-company-id'];
      if (String(order.company_id) !== String(companyId)) {
        throw new ForbiddenError('Order does not belong to your company');
      }
    } else if (sender_type === 'driver') {
      const assignment = await Assignment.findOne({
        where: { order_id: orderId, driver_id: sender_id },
      });
      if (!assignment) throw new ForbiddenError('Driver not assigned to this order');
    } else if (sender_type === 'recipient') {
      if (order.tracking_code !== tracking_code) {
        throw new ForbiddenError('Invalid tracking code');
      }
    }

    const message = await Message.create({
      order_id: orderId,
      channel,
      sender_type,
      sender_id: sender_id || null,
      sender_name,
      text,
    });

    // Reload to get DB-generated timestamps (created_at may be null right after create)
    await message.reload();

    const formatted = {
      id: message.id,
      orderId: Number(orderId),
      channel: message.channel,
      senderType: message.sender_type,
      senderId: message.sender_id,
      senderName: message.sender_name,
      text: message.text,
      isRead: message.is_read,
      time: message.created_at?.toISOString() || new Date().toISOString(),
    };

    // Emit via Socket.io — room is scoped to order+channel
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${orderId}:chat:${channel}`).emit('message:new', formatted);
    }

    return success(res, formatted, null, 201);
  } catch (err) {
    next(err);
  }
};

// ── Mark messages as read ──

/**
 * PUT /api/messages/:orderId/:channel/read
 * Body: { role }
 */
const markAsRead = async (req, res, next) => {
  try {
    const { orderId, channel } = req.params;
    const { role } = req.body;

    if (!role) throw new ValidationError('role is required');

    const [count] = await Message.update(
      { is_read: true },
      { where: { order_id: orderId, channel, sender_type: { [Op.ne]: role }, is_read: false } },
    );

    return success(res, { markedRead: count });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
};
