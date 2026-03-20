const router = require('express').Router();
const tenantResolver = require('../../middlewares/tenantResolver');
const { getStats, getUser } = require('../../controllers/dashboard/dispatcherDashboardController');

router.get('/stats', tenantResolver, getStats);
router.get('/user', tenantResolver, getUser);

module.exports = router;
