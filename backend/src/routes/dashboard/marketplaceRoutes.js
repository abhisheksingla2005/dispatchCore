const router = require('express').Router();
const {
  getMarketplaceListings,
} = require('../../controllers/dashboard/marketplaceDashboardController');

router.get('/marketplace-listings', getMarketplaceListings);

module.exports = router;
