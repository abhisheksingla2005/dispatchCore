/**
 * Mail Service
 *
 * Centralized email dispatch layer using Resend.
 * All outgoing emails go through this service for consistent
 * logging, error handling, quota enforcement, and template rendering.
 *
 * Resend is an API-based email service with no SMTP port restrictions,
 * making it ideal for platforms like Render. When RESEND_API_KEY is not
 * configured, emails are logged to console instead — safe for local development.
 *
 * Quota enforcement prevents exceeding Resend free tier limits:
 * - 100 emails/day
 * - 3,000 emails/month
 */

const { client } = require('../config/mail');
const env = require('../config/env');
const logger = require('../config/logger');
const { checkQuota, recordEmailSent } = require('./emailQuotaService');
const verificationTemplate = require('../utils/emailTemplates/verificationTemplate');
const orderBidTemplate = require('../utils/emailTemplates/orderBidTemplate');
const orderAssignedTemplate = require('../utils/emailTemplates/orderAssignedTemplate');
const orderTrackingTemplate = require('../utils/emailTemplates/orderTrackingTemplate');
const welcomeTemplate = require('../utils/emailTemplates/welcomeTemplate');

/**
 * Send a raw email via Resend with quota enforcement.
 *
 * @param {string|string[]} to - Recipient address(es)
 * @param {string} subject - Email subject line
 * @param {string} html - Rendered HTML content
 * @param {string} [idempotencyKey] - Optional idempotency key for safe retries
 * @param {string} [emailType] - Email type for quota tracking (verification, bid, etc)
 * @returns {Promise<object|null>} Resend response { data, error }, or null if skipped/blocked
 * @throws {Error} If quota exceeded or email sending fails
 */
const sendMail = async (to, subject, html, idempotencyKey, emailType = 'unknown') => {
  if (!client) {
    logger.info({ to, subject }, 'Email skipped — Resend not configured');
    return null;
  }

  // Check quota before sending
  const quotaCheck = await checkQuota(emailType);
  if (!quotaCheck.allowed) {
    logger.warn(
      {
        to,
        subject,
        emailType,
        reason: quotaCheck.reason,
        dailyUsage: quotaCheck.dailyUsage,
        monthlyUsage: quotaCheck.monthlyUsage,
      },
      'Email blocked — quota limit exceeded',
    );
    throw new Error(`Email quota exceeded: ${quotaCheck.reason}`);
  }

  try {
    const { data, error } = await client.emails.send({
      from: env.email.from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(idempotencyKey && { idempotencyKey }),
    });

    if (error) {
      logger.error({ err: error, to, subject, emailType }, 'Failed to send email via Resend');
      throw new Error(error.message);
    }

    // Record successful send in quota
    await recordEmailSent(emailType);

    logger.info(
      {
        messageId: data.id,
        to,
        emailType,
        dailyUsed: quotaCheck.dailyUsage + 1,
        monthlyUsed: quotaCheck.monthlyUsage + 1,
      },
      'Email sent',
    );
    return data;
  } catch (error) {
    logger.error({ err: error, to, subject, emailType }, 'Error sending email');
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
  const idempotencyKey = `verification/${user.email}`;
  return sendMail(user.email, subject, html, idempotencyKey, 'verification');
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
  const idempotencyKey = `bid-update/${orderId}/${driver.email}`;
  return sendMail(driver.email, subject, html, idempotencyKey, 'bid-update');
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
  const idempotencyKey = `order-assigned/${order.id}/${driver.email}`;
  return sendMail(driver.email, subject, html, idempotencyKey, 'order-assigned');
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
  const idempotencyKey = `tracking/${order.id}`;
  return sendMail(order.recipient_email, subject, html, idempotencyKey, 'tracking');
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
  const idempotencyKey = `welcome/${user.email}`;
  return sendMail(user.email, subject, html, idempotencyKey, 'welcome');
};

module.exports = {
  sendMail,
  sendVerificationEmail,
  sendBidUpdateEmail,
  sendOrderAssignedEmail,
  sendTrackingEmail,
  sendWelcomeEmail,
};
