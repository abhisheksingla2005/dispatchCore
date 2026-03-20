const { Order, Bid, Company } = require('../../models');
const { success } = require('../../utils/response');
const { ORDER_STATUS, BID_STATUS } = require('../../utils/constants');
const { Op } = require('sequelize');

const getStats = async (req, res, next) => {
  try {
    const companyId = req.tenantId;

    const [total, unassigned, listed, assigned, delivered, cancelled] = await Promise.all([
      Order.count({ where: { company_id: companyId } }),
      Order.count({ where: { company_id: companyId, status: ORDER_STATUS.UNASSIGNED } }),
      Order.count({ where: { company_id: companyId, status: ORDER_STATUS.LISTED } }),
      Order.count({ where: { company_id: companyId, status: ORDER_STATUS.ASSIGNED } }),
      Order.count({ where: { company_id: companyId, status: ORDER_STATUS.DELIVERED } }),
      Order.count({ where: { company_id: companyId, status: ORDER_STATUS.CANCELLED } }),
    ]);

    const inProgress = await Order.count({
      where: {
        company_id: companyId,
        status: { [Op.in]: [ORDER_STATUS.PICKED_UP, ORDER_STATUS.EN_ROUTE] },
      },
    });

    const activeBids = await Bid.count({
      where: { status: BID_STATUS.PENDING },
      include: [{ model: Order, as: 'order', where: { company_id: companyId }, attributes: [] }],
    });

    return success(res, {
      totalOrders: total,
      unassigned,
      listed,
      assigned,
      inProgress,
      delivered,
      cancelled,
      activeBids,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const companyId = req.identity?.companyId ?? req.tenantId ?? null;
    if (!companyId) {
      return success(res, {
        name: 'Guest',
        email: '',
        location: '',
        initials: 'G',
        newDeliveries: 0,
      });
    }

    const company = await Company.findByPk(companyId);
    if (!company) {
      return success(res, {
        name: 'Unknown',
        email: '',
        location: '',
        initials: '?',
        newDeliveries: 0,
      });
    }

    const newDeliveries = await Order.count({
      where: { company_id: companyId, status: ORDER_STATUS.UNASSIGNED },
    });

    const initials = company.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return success(res, {
      name: company.name,
      email: company.email || '',
      phone: company.phone,
      location: company.location || '',
      initials,
      newDeliveries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUser,
};
