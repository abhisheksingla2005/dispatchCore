/**
 * Email Verification Template
 *
 * Sent to new users (companies/drivers) to verify their email address.
 * Security-focused design with clear call-to-action.
 *
 * @param {object} params
 * @param {string} params.name - User display name
 * @param {string} params.verificationLink - URL to verify email
 * @returns {{ subject: string, html: string }}
 */
const baseLayout = require('./baseLayout');

const verificationTemplate = ({ name, verificationLink }) => {
  const subject = 'Verify Your Email - dispatchCore';

  const body = `
    <p>Hi ${name},</p>
    <p>Welcome to dispatchCore! To complete your account setup and start using the platform, please verify your email address by clicking the button below.</p>
    
    <div class="btn-center">
      <a href="${verificationLink}" class="btn">Verify Email Address</a>
    </div>

    <div class="divider"></div>

    <p style="font-size: 13px; color: #78716c;">If the button above doesn't work, copy and paste this link into your browser:</p>
    <div class="code-block">${verificationLink}</div>

    <p style="color: #9ca3af; font-size: 13px;">
      This verification link expires in 24 hours. If you didn't create an account with dispatchCore, you can safely ignore this email.
    </p>
  `;

  return { subject, html: baseLayout('Verify Your Email', body) };
};

module.exports = verificationTemplate;
