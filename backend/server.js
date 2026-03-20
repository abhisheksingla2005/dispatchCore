/**
 * Server Entry Point
 *
 * Creates the HTTP server, attaches Socket.io, and mounts Express.
 * Initializes runtime services and graceful shutdown handling.
 *
 * Also handles graceful shutdown — closes sockets, drains DB pool,
 * and stops accepting new connections before exiting.
 */

const http = require('http');

const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/config/logger');
const { sequelize } = require('./src/models');
const {
  createSocketServer,
  registerServices,
  registerShutdownHandlers,
} = require('./src/bootstrap/runtime');

/**
 * Authenticate infrastructure dependencies, compose runtime services,
 * and begin accepting HTTP/WebSocket traffic.
 */
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database authenticated');

    const server = http.createServer(app);
    const io = createSocketServer(server);
    logger.info('WebSocket initialized');

    registerServices(app, io);

    server.on('error', (error) => {
      logger.error({ err: error }, 'HTTP server failed');
      process.exit(1);
    });

    server.listen(env.port, () => {
      logger.info({ port: env.port, nodeEnv: env.nodeEnv }, 'Server started');
    });

    registerShutdownHandlers({ server, io, sequelize, logger });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
