/**
 * History Controller
 *
 * Role-scoped delivery history with pagination.
 * Dispatchers see full details; drivers see limited fields.
 */

const { success } = require('../utils/response');
const { ROLES } = require('../utils/constants');
const { Driver } = require('../models');

const getHistory = async (req, res, next) => {
  try {
    const historyService = req.app.get('historyService');
    const { status, dateFrom, dateTo, page, limit } = req.query;
    const filters = { status, dateFrom, dateTo, page, limit };

    const driverId = req.identity?.driverId ?? null;
    const isDispatcherScope = Boolean(req.tenantId || req.identity?.companyId || req.identity?.isSuperadmin);

    let result;

    if (driverId) {
      const driver = await Driver.findByPk(driverId);
      const driverType = driver ? driver.type : 'EMPLOYED';
      result = await historyService.getDriverHistory(driverId, driverType, filters);
    } else if (isDispatcherScope) {
      result = await historyService.getDispatcherHistory(req.tenantId, filters);
    } else {
      result = { records: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    }

    return success(res, result.records, result.meta);
  } catch (error) {
    next(error);
  }
};

const getDeliveryDetail = async (req, res, next) => {
  try {
    const historyService = req.app.get('historyService');

    const driverId = req.identity?.driverId ?? null;
    const role = driverId ? 'driver' : ROLES.DISPATCHER;

    const record = await historyService.getDeliveryDetail(
      parseInt(req.params.assignmentId, 10),
      role,
      driverId,
    );

    if (!record) {
      const { NotFoundError } = require('../utils/errors');
      throw new NotFoundError('Delivery record');
    }

    return success(res, record);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, getDeliveryDetail };
