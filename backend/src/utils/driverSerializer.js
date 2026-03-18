/**
 * Driver Serializer
 *
 * Compatibility shim for the frontend driver data shape.
 * The frontend expects a nested `user` object ({ id, name, email, phone })
 * on driver records. Since the Driver model stores these fields at the root
 * level, this module generates the expected shape without DB changes.
 *
 * Once the frontend is updated to read root-level fields, this module
 * can be removed.
 */

/**
 * Build a legacy `user` sub-object from root-level driver fields.
 *
 * @param {object} driver - Driver record (Sequelize instance or plain object)
 * @returns {{ id: number, name: string|null, email: string|null, phone: string|null }}
 */
const toLegacyUser = (driver) => ({
  id: driver.id,
  name: driver.name ?? null,
  email: driver.email ?? null,
  phone: driver.phone ?? null,
});

/**
 * Serialize a driver to a plain object with the legacy `user` sub-object.
 * Handles both Sequelize model instances and plain objects.
 *
 * @param {object|null} driver - Driver Sequelize instance or plain object
 * @returns {object|null} Plain driver object with `user` field, or null/undefined if input is falsy
 */
const serializeDriver = (driver) => {
  if (!driver) {
    return driver;
  }

  const plain = typeof driver.get === 'function' ? driver.get({ plain: true }) : { ...driver };
  if (!plain.user) {
    plain.user = toLegacyUser(plain);
  }
  return plain;
};

/**
 * Attach the legacy `user` shape directly onto a Sequelize model instance's dataValues.
 * Used when the model will be further serialized by Sequelize's `toJSON()`.
 *
 * @param {object|null} driver - Sequelize Driver model instance
 * @returns {object|null} The same instance with `dataValues.user` attached
 */
const attachLegacyUserShape = (driver) => {
  if (!driver || !driver.dataValues) {
    return driver;
  }

  driver.dataValues.user = toLegacyUser(driver.dataValues);
  return driver;
};

module.exports = { serializeDriver, attachLegacyUserShape };
