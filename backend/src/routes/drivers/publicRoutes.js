const router = require('express').Router();
const { createIndependentDriver } = require('../../controllers/drivers/managementController');
const {
  createIndependentDriver: createIndependentDriverValidator,
} = require('../../validators/driverValidator');
const validate = require('../../middlewares/validate');

router.post('/signup', createIndependentDriverValidator, validate, createIndependentDriver);

module.exports = router;
