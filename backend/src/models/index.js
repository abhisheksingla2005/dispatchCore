/**
 * Sequelize Model Index
 *
 * Initializes Sequelize, registers all models, and sets up associations.
 * This is the single entry point for all database access.
 */

const { Sequelize } = require('sequelize');
const env = require('../config/env');
const databaseConfig = require('../config/database');
const logger = require('../config/logger');

const runtimeConfig = databaseConfig[env.nodeEnv] || databaseConfig.development;

// Create Sequelize instance from the shared DB config so runtime and CLI stay aligned.
const sequelize = new Sequelize(
  runtimeConfig.database,
  runtimeConfig.username,
  runtimeConfig.password,
  {
    ...runtimeConfig,
    logging: runtimeConfig.logging
      ? (sql) => logger.debug({ sql }, 'Sequelize query')
      : false,
  },
);

// Register models
const models = {
  Company: require('./Company')(sequelize),
  Driver: require('./Driver')(sequelize),
  DriverRoute: require('./DriverRoute')(sequelize),
  Vehicle: require('./Vehicle')(sequelize),
  Hub: require('./Hub')(sequelize),
  Order: require('./Order')(sequelize),
  Bid: require('./Bid')(sequelize),
  Assignment: require('./Assignment')(sequelize),
  RouteStop: require('./RouteStop')(sequelize),
  DriverLocationLog: require('./DriverLocationLog')(sequelize),
  DeliveryEvent: require('./DeliveryEvent')(sequelize),
  Message: require('./Message')(sequelize),
  SuperadminSetting: require('./SuperadminSetting')(sequelize),
};

// Setup associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
