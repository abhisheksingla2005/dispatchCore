const router = require('express').Router();
const tenantResolver = require('../../middlewares/tenantResolver');
const validate = require('../../middlewares/validate');
const {
  getDriver: getDriverValidator,
  createDriver: createDriverValidator,
  verifyDriver: verifyDriverValidator,
} = require('../../validators/driverValidator');
const {
  getDrivers,
  getDriverById,
  verifyDriver,
  createDriver,
  updateDriverStatus,
} = require('../../controllers/drivers/managementController');

router.get('/', tenantResolver, getDrivers);
router.post('/', tenantResolver, createDriverValidator, validate, createDriver);
router.get('/:id', getDriverValidator, validate, getDriverById);
router.put('/:id/verify', verifyDriverValidator, validate, verifyDriver);
router.patch('/:id/status', updateDriverStatus);

module.exports = router;
