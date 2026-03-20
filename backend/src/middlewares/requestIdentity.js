const { ROLES } = require('../utils/constants');

function parsePositiveInt(value) {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Normalize CE-01 header-based identity into a single request shape.
 * This keeps controller logic consistent now and makes CE-02 auth migration
 * simpler because the rest of the app can depend on req.identity.
 */
const requestIdentity = (req, res, next) => {
  const headerCompanyId = parsePositiveInt(req.headers['x-company-id']);
  const headerDriverId = parsePositiveInt(req.headers['x-driver-id']);
  const userCompanyId = req.user ? parsePositiveInt(req.user.company_id) : null;
  const userDriverId = req.user ? parsePositiveInt(req.user.driver_id) : null;
  const isSuperadmin = req.user?.role === ROLES.SUPERADMIN;

  const companyId = headerCompanyId ?? userCompanyId;
  const driverId = headerDriverId ?? userDriverId;

  let actorType = 'anonymous';
  if (isSuperadmin) {
    actorType = ROLES.SUPERADMIN;
  } else if (driverId) {
    actorType = 'driver';
  } else if (companyId) {
    actorType = ROLES.DISPATCHER;
  }

  req.identity = {
    companyId,
    driverId,
    actorType,
    isSuperadmin,
  };

  next();
};

module.exports = requestIdentity;
