/**
 * Mail Configuration (Nodemailer)
 *
 * Creates and exports a reusable SMTP transport.
 * Falls back to a no-op transport when SMTP_HOST is not configured,
 * allowing the server to boot without email credentials during local dev.
 */

const nodemailer = require('nodemailer');
const env = require('./env');
const logger = require('./logger');

let transporter = null;

if (env.smtp.host) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    requireTLS: !env.smtp.secure, // Enable STARTTLS when secure=false
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
    family: 4, // Force IPv4 (required for Render)
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
} else {
  logger.warn('SMTP_HOST not configured — emails will be logged to console only');
}

/**
 * Verify the SMTP connection is working.
 * Call during server startup for early failure detection.
 *
 * @returns {Promise<boolean>} true if connected, false otherwise
 */
const verifyConnection = async () => {
  if (!transporter) {
    logger.warn('Mail transporter not initialized — skipping verify');
    return false;
  }

  try {
    await transporter.verify();
    logger.info('SMTP connection verified');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'SMTP connection verification failed');
    return false;
  }
};

module.exports = { transporter, verifyConnection };
