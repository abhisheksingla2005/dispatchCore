const { Bid, Assignment, Order } = require('../../models');
const { success } = require('../../utils/response');
const { ORDER_STATUS, BID_STATUS } = require('../../utils/constants');
const { Op } = require('sequelize');

const getDriverStats = async (req, res, next) => {
  try {
    const driverId = req.identity?.driverId ?? null;

    if (!driverId) {
      return success(res, {
        activeDeliveries: 0,
        completedToday: 0,
        completedTotal: 0,
        pendingBids: 0,
        acceptedBidsToday: 0,
        rating: 0,
      });
    }

    const [activeDeliveries, completedTotal, pendingBids] = await Promise.all([
      Assignment.count({
        include: [
          {
            model: Order,
            as: 'order',
            where: {
              status: {
                [Op.in]: [ORDER_STATUS.ASSIGNED, ORDER_STATUS.PICKED_UP, ORDER_STATUS.EN_ROUTE],
              },
            },
            attributes: [],
          },
        ],
        where: { driver_id: driverId },
      }),
      Assignment.count({
        include: [
          {
            model: Order,
            as: 'order',
            where: { status: ORDER_STATUS.DELIVERED },
            attributes: [],
          },
        ],
        where: { driver_id: driverId },
      }),
      Bid.count({
        where: { driver_id: driverId, status: BID_STATUS.PENDING },
      }),
    ]);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const completedToday = await Assignment.count({
      include: [
        {
          model: Order,
          as: 'order',
          where: { status: ORDER_STATUS.DELIVERED },
          attributes: [],
        },
      ],
      where: {
        driver_id: driverId,
        updated_at: { [Op.gte]: startOfDay },
      },
    });

    return success(res, {
      activeDeliveries,
      completedToday,
      completedTotal,
      pendingBids,
      rating: null,
    });
  } catch (error) {
    next(error);
  }
};

const getDriverBids = async (req, res, next) => {
  try {
    const driverId = req.identity?.driverId ?? null;

    if (!driverId) {
      return success(res, []);
    }

    const bids = await Bid.findAll({
      where: { driver_id: driverId },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [
            'id',
            'tracking_code',
            'pickup_address',
            'delivery_address',
            'listed_price',
            'weight_kg',
            'status',
            'priority',
            'company_id',
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return success(res, bids);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDriverStats,
  getDriverBids,
};
