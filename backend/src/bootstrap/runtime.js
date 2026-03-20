const { Server: SocketIO } = require('socket.io');
const env = require('../config/env');

const AssignmentService = require('../services/assignmentService');
const MarketplaceService = require('../services/marketplaceService');
const LocationService = require('../services/locationService');
const RouteMatchingService = require('../services/routeMatchingService');
const HistoryService = require('../services/historyService');

const { initializeSocket } = require('../sockets');

const wsCorsOrigins = env.wsCorsOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function createSocketServer(server) {
  const io = new SocketIO(server, {
    cors: {
      origin: wsCorsOrigins,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  initializeSocket(io);
  return io;
}

function registerServices(app, io) {
  const services = {
    assignmentService: new AssignmentService(io),
    marketplaceService: new MarketplaceService(io),
    locationService: new LocationService(io),
    routeMatchingService: new RouteMatchingService(),
    historyService: new HistoryService(),
  };

  Object.entries(services).forEach(([key, service]) => {
    app.set(key, service);
  });

  app.set('io', io);
  io.locationService = services.locationService;

  return services;
}

function registerShutdownHandlers({ server, io, sequelize, logger }) {
  let isShuttingDown = false;
  let forceExitTimer = null;

  const shutdown = async () => {
    if (isShuttingDown) {
      logger.info('Shutdown already in progress');
      return;
    }

    isShuttingDown = true;
    logger.info('Starting graceful shutdown');

    forceExitTimer = setTimeout(() => {
      logger.error('Forced termination after timeout');
      process.exit(1);
    }, 10000);

    try {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) return reject(error);
          resolve();
        });
      });
      logger.info('HTTP server closed');

      await new Promise((resolve) => {
        io.close(() => resolve());
      });
      logger.info('WebSocket connections closed');

      await sequelize.close();
      logger.info('Database pool drained');

      clearTimeout(forceExitTimer);
      logger.info('Termination complete');
      process.exit(0);
    } catch (error) {
      clearTimeout(forceExitTimer);
      logger.error({ err: error }, 'Graceful shutdown failed');
      process.exit(1);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = {
  createSocketServer,
  registerServices,
  registerShutdownHandlers,
};
