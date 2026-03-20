const { Order, Bid, Company } = require('../../models');
const { success } = require('../../utils/response');
const { ORDER_STATUS } = require('../../utils/constants');

const getMarketplaceListings = async (req, res, next) => {
  try {
    const { sort = 'newest', page = 1, limit = 20 } = req.query;

    const orderClause = [];
    switch (sort) {
      case 'price':
        orderClause.push(['listed_price', 'DESC']);
        break;
      case 'weight':
        orderClause.push(['weight_kg', 'DESC']);
        break;
      case 'priority':
        orderClause.push(['priority', 'ASC']);
        break;
      default:
        orderClause.push(['created_at', 'DESC']);
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    const { rows, count } = await Order.findAndCountAll({
      where: { status: ORDER_STATUS.LISTED },
      order: orderClause,
      limit: pageSize,
      offset,
      include: [
        { model: Bid, as: 'bids', attributes: ['id'] },
        { model: Company, as: 'company', attributes: ['id', 'name'] },
      ],
    });

    const listings = rows.map((order) => ({
      id: order.id,
      trackingCode: order.tracking_code,
      pickupAddress: order.pickup_address,
      pickupLat: order.pickup_lat ? parseFloat(order.pickup_lat) : null,
      pickupLng: order.pickup_lng ? parseFloat(order.pickup_lng) : null,
      deliveryAddress: order.delivery_address,
      deliveryLat: order.delivery_lat ? parseFloat(order.delivery_lat) : null,
      deliveryLng: order.delivery_lng ? parseFloat(order.delivery_lng) : null,
      listedPrice: parseFloat(order.listed_price),
      weight: parseFloat(order.weight_kg),
      priority: order.priority,
      postedAt: order.created_at,
      bidsCount: order.bids ? order.bids.length : 0,
      companyId: order.company_id,
      companyName: order.company ? order.company.name : null,
    }));

    return success(res, listings, {
      total: count,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMarketplaceListings };
