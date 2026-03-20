const router = require('express').Router();
const publicRoutes = require('./drivers/publicRoutes');
const routeRoutes = require('./drivers/routeRoutes');
const profileRoutes = require('./drivers/profileRoutes');
const managementRoutes = require('./drivers/managementRoutes');

router.use('/', publicRoutes);
router.use('/', routeRoutes);
router.use('/', profileRoutes);
router.use('/', managementRoutes);

module.exports = router;
