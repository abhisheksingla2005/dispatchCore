/**
 * Mail Service
 *
 * Centralized email dispatch layer using Nodemailer.
 * All outgoing emails go through this service for consistent
 * logging, error handling, and template rendering.
 *
 * When SMTP is not configured (no SMTP_HOST), emails are logged
 * to console instead of being sent — safe for local development.
 */

const { transporter } = require('../config/mail');
const env = require('../config/env');
const logger = require('../config/logger');
const verificationTemplate = require('../utils/emailTemplates/verificationTemplate');
const orderBidTemplate = require('../utils/emailTemplates/orderBidTemplate');
const orderAssignedTemplate = require('../utils/emailTemplates/orderAssignedTemplate');
const orderTrackingTemplate = require('../utils/emailTemplates/orderTrackingTemplate');
const welcomeTemplate = require('../utils/emailTemplates/welcomeTemplate');

/**
 * Send a raw email via the SMTP transport.
 *
 * @param {string|string[]} to - Recipient address(es)
 * @param {string} subject - Email subject line
 * @param {string} html - Rendered HTML content
 * @returns {Promise<object|null>} Nodemailer send result, or null if skipped
 */
const sendMail = async (to, subject, html) => {
  if (!transporter) {
    logger.info({ to, subject }, 'Email skipped — SMTP not configured');
    return null;
  }

  try {
    const result = await transporter.sendMail({
      from: env.smtp.from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    });

    logger.info({ messageId: result.messageId, to }, 'Email sent');
    return result;
  } catch (error) {
    logger.error({ err: error, to, subject }, 'Failed to send email');
    throw error;
  }
};

/**
 * Send a verification email to a new user.
 *
 * @param {{ name: string, email: string }} user
 * @param {string} verificationLink
 */
const sendVerificationEmail = async (user, verificationLink) => {
  const { subject, html } = verificationTemplate({
    name: user.name,
    verificationLink,
  });
  return sendMail(user.email, subject, html);
};

/**
 * Send a bid status update email to a driver.
 *
 * @param {{ name: string, email: string }} driver
 * @param {object} params
 * @param {number|string} params.orderId
 * @param {number|string} params.bidAmount
 * @param {'ACCEPTED'|'REJECTED'|'PENDING'} params.status
 */
const sendBidUpdateEmail = async (driver, { orderId, bidAmount, status }) => {
  const dashboardLink = `${env.frontendUrl}/driver/dashboard`;
  const { subject, html } = orderBidTemplate({
    driverName: driver.name,
    orderId,
    bidAmount,
    status,
    dashboardLink,
  });
  return sendMail(driver.email, subject, html);
};

/**
 * Send an order assignment email to a driver.
 *
 * @param {{ name: string, email: string }} driver
 * @param {object} order
 * @param {number|string} order.id
 * @param {string} order.pickup_address
 * @param {string} order.delivery_address
 */
const sendOrderAssignedEmail = async (driver, order) => {
  const isEmployed = driver.type === 'EMPLOYED' && !!driver.company_id;
  const dashboardLink = `${env.frontendUrl}${isEmployed ? '/employed-driver/dashboard' : '/driver/dashboard'}`;
  const { subject, html } = orderAssignedTemplate({
    driverName: driver.name,
    orderId: order.id,
    pickupAddress: order.pickup_address || 'N/A',
    deliveryAddress: order.delivery_address || 'N/A',
    dashboardLink,
  });
  return sendMail(driver.email, subject, html);
};

/**
 * Send a tracking email to an order recipient.
 *
 * @param {object} order
 * @param {string} order.tracking_code
 * @param {string} order.recipient_email
 * @param {string} [order.recipient_name]
 * @param {string} [order.pickup_address]
 * @param {string} [order.delivery_address]
 */
const sendTrackingEmail = async (order) => {
  if (!order.recipient_email) {
    logger.debug({ orderId: order.id }, 'No recipient email — tracking email skipped');
    return null;
  }

  const trackingUrl = `${env.frontendUrl}/track/${order.tracking_code}`;
  const { subject, html } = orderTrackingTemplate({
    recipientName: order.recipient_name,
    trackingCode: order.tracking_code,
    trackingUrl,
    pickupAddress: order.pickup_address,
    deliveryAddress: order.delivery_address,
  });
  return sendMail(order.recipient_email, subject, html);
};

/**
 * Send a welcome email after successful registration.
 *
 * @param {{ name: string, email: string }} user
 * @param {'company'|'driver'} accountType
 */
const sendWelcomeEmail = async (user, accountType) => {
  const isCompany = accountType === 'company';
  const dashboardLink = `${env.frontendUrl}${isCompany ? '/dashboard' : '/driver/dashboard'}`;
  const { subject, html } = welcomeTemplate({
    name: user.name,
    email: user.email,
    accountType,
    dashboardLink,
  });
  return sendMail(user.email, subject, html);
};

module.exports = {
  sendMail,
  sendVerificationEmail,
  sendBidUpdateEmail,
  sendOrderAssignedEmail,
  sendTrackingEmail,
  sendWelcomeEmail,
};
