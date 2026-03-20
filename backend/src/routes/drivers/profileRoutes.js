const router = require('express').Router();
const validate = require('../../middlewares/validate');
const {
  updateDriver: updateDriverValidator,
  updateDriverPassword: updateDriverPasswordValidator,
  updateDriverVehicle: updateDriverVehicleValidator,
} = require('../../validators/driverValidator');
const {
  updateDriver,
  updateDriverPassword,
  updateDriverVehicle,
} = require('../../controllers/drivers/profileController');

router.put('/:id', updateDriverValidator, validate, updateDriver);
router.put('/:id/password', updateDriverPasswordValidator, validate, updateDriverPassword);
router.put('/:id/vehicle', updateDriverVehicleValidator, validate, updateDriverVehicle);

module.exports = router;
