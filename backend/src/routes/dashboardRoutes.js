const router = require('express').Router();
const dispatcherRoutes = require('./dashboard/dispatcherRoutes');
const driverRoutes = require('./dashboard/driverRoutes');
const marketplaceRoutes = require('./dashboard/marketplaceRoutes');

router.use('/', dispatcherRoutes);
router.use('/', marketplaceRoutes);
router.use('/', driverRoutes);

module.exports = router;
