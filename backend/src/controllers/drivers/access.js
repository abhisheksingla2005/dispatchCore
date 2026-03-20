const { UnauthorizedError } = require('../../utils/errors');

const ensureDriverAccess = (req, driver) => {
  const actorDriverId = req.identity?.driverId ?? null;
  const actorCompanyId = req.identity?.companyId ?? null;

  if (actorDriverId && actorDriverId === driver.id) {
    return;
  }

  if (actorCompanyId && driver.company_id && actorCompanyId === driver.company_id) {
    return;
  }

  throw new UnauthorizedError('You do not have access to update this driver');
};

module.exports = { ensureDriverAccess };
