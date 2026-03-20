const router = require('express').Router();
const {
  getDriverStats,
  getDriverBids,
} = require('../../controllers/dashboard/driverDashboardController');

router.get('/driver-stats', getDriverStats);
router.get('/driver-bids', getDriverBids);

module.exports = router;
