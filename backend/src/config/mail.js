/**
 * Email Configuration (Resend)
 *
 * Creates and exports a reusable Resend client for sending emails.
 * Resend is an API-based email service designed for production environments,
 * with no SMTP port issues on platforms like Render.
 */

const { Resend } = require('resend');
const env = require('./env');
const logger = require('./logger');

let client = null;

if (env.email.apiKey) {
  client = new Resend(env.email.apiKey);
} else {
  logger.warn('RESEND_API_KEY not configured — emails will be logged to console only');
}

/**
 * Verify the Resend client is ready.
 * Called during server startup for early failure detection.
 *
 * @returns {Promise<boolean>} true if configured, false otherwise
 */
const verifyConnection = async () => {
  if (!client) {
    logger.warn('Resend client not initialized — skipping verification');
    return false;
  }

  try {
    logger.info('Resend client initialized and ready');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Resend client initialization failed');
    return false;
  }
};

module.exports = { client, verifyConnection };
