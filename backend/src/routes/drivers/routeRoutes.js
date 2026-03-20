const router = require('express').Router();
const validate = require('../../middlewares/validate');
const {
  registerRoute: registerRouteValidator,
  findNearbyDrivers: findNearbyDriversValidator,
} = require('../../validators/driverValidator');
const {
  registerRoute,
  findNearbyDrivers,
  getMyRoutes,
  deactivateRoute,
  getActiveRoutesForDispatchers,
} = require('../../controllers/drivers/routeController');

router.get('/routes/nearby', findNearbyDriversValidator, validate, findNearbyDrivers);
router.get('/routes/active', getActiveRoutesForDispatchers);
router.get('/routes/mine', getMyRoutes);
router.post('/routes', registerRouteValidator, validate, registerRoute);
router.delete('/routes/:routeId', deactivateRoute);

module.exports = router;
