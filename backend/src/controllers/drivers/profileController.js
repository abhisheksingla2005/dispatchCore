const { Driver, Vehicle, Company } = require('../../models');
const { success } = require('../../utils/response');
const { NotFoundError, ConflictError } = require('../../utils/errors');
const { verifyPassword, hashPassword } = require('../../utils/password');
const { serializeDriver } = require('../../utils/driverSerializer');
const { ensureEmailAvailable } = require('../../utils/emailUniqueness');
const {
  DRIVER_NOTIFICATION_DEFAULTS,
  APPEARANCE_DEFAULTS,
} = require('../../utils/defaults');
const { ensureDriverAccess } = require('./access');

const updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'address'],
          required: false,
        },
        { model: Vehicle, as: 'vehicle' },
      ],
    });

    if (!driver) {
      throw new NotFoundError('Driver');
    }

    ensureDriverAccess(req, driver);

    const {
      name,
      email,
      phone,
      license_number,
      notification_preferences,
      appearance_preferences,
    } = req.body;

    if (email && email.trim().toLowerCase() !== driver.email) {
      await ensureEmailAvailable(email.trim().toLowerCase(), { driverId: driver.id });
    }

    await driver.update({
      name: name ?? driver.name,
      email: email ? email.trim().toLowerCase() : driver.email,
      phone: phone ?? driver.phone,
      license_number: license_number ?? driver.license_number,
      notification_preferences:
        notification_preferences ?? driver.notification_preferences ?? DRIVER_NOTIFICATION_DEFAULTS,
      appearance_preferences:
        appearance_preferences ?? driver.appearance_preferences ?? APPEARANCE_DEFAULTS,
    });

    await driver.reload({
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'address'],
          required: false,
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'plate_number', 'type', 'capacity_kg', 'status'],
          required: false,
        },
      ],
    });

    return success(res, serializeDriver(driver));
  } catch (error) {
    next(error);
  }
};

const updateDriverPassword = async (req, res, next) => {
  try {
    const driver = await Driver.findByPk(req.params.id);

    if (!driver) {
      throw new NotFoundError('Driver');
    }

    ensureDriverAccess(req, driver);

    const { current_password, new_password } = req.body;

    if (!verifyPassword(current_password, driver.password_hash)) {
      throw new ConflictError('Current password is incorrect');
    }

    await driver.update({
      password_hash: hashPassword(new_password),
    });

    return success(res, { updated: true });
  } catch (error) {
    next(error);
  }
};

const updateDriverVehicle = async (req, res, next) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [{ model: Vehicle, as: 'vehicle' }],
    });

    if (!driver) {
      throw new NotFoundError('Driver');
    }

    ensureDriverAccess(req, driver);

    const { type, plate_number, capacity_kg, status } = req.body;

    if (!driver.vehicle) {
      const vehicle = await Vehicle.create({
        driver_id: driver.id,
        company_id: driver.company_id ?? null,
        type,
        plate_number,
        capacity_kg,
        status: status ?? 'ACTIVE',
      });
      return success(res, vehicle, null, 201);
    }

    if (plate_number && plate_number !== driver.vehicle.plate_number) {
      const existingVehicle = await Vehicle.findOne({ where: { plate_number } });
      if (existingVehicle && existingVehicle.id !== driver.vehicle.id) {
        throw new ConflictError('A vehicle with this plate number already exists');
      }
    }

    await driver.vehicle.update({
      type: type ?? driver.vehicle.type,
      plate_number: plate_number ?? driver.vehicle.plate_number,
      capacity_kg: capacity_kg ?? driver.vehicle.capacity_kg,
      status: status ?? driver.vehicle.status,
      company_id: driver.company_id ?? null,
    });

    return success(res, driver.vehicle);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateDriver,
  updateDriverPassword,
  updateDriverVehicle,
};
