/**
 * Email Verification Template
 *
 * Sent to new users (companies/drivers) to verify their email address.
 *
 * @param {object} params
 * @param {string} params.name - User display name
 * @param {string} params.verificationLink - URL to verify email
 * @returns {{ subject: string, html: string }}
 */
const baseLayout = require('./baseLayout');

const verificationTemplate = ({ name, verificationLink }) => {
  const subject = 'Verify Your Email — dispatchCore';

  const body = `
    <p>Hi ${name},</p>
    <p>Welcome to dispatchCore! To get started, please verify your email address by clicking the button below.</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verificationLink}" class="btn">Verify Email Address</a>
    </div>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="font-size: 13px; color: #7c83ff; word-break: break-all;">${verificationLink}</p>
    <p style="color: #9ca3af; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
  `;

  return { subject, html: baseLayout('Verify Your Email', body) };
};

module.exports = verificationTemplate;
