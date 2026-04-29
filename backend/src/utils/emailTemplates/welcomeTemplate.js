/**
 * Welcome Email Template
 *
 * Sent to new users after successful registration.
 * Provides a warm onboarding message with a link to their dashboard.
 *
 * @param {object} params
 * @param {string} params.name - User display name
 * @param {string} params.email - User email
 * @param {'company'|'driver'} params.accountType - Account type
 * @param {string} params.dashboardLink - Link to user dashboard
 * @returns {{ subject: string, html: string }}
 */
const baseLayout = require('./baseLayout');

const welcomeTemplate = ({ name, email, accountType, dashboardLink }) => {
  const subject = `Welcome to dispatchCore, ${name}`;

  const isCompany = accountType === 'company';

  const body = `
    <p>Hi ${name},</p>
    <p>Welcome aboard! Your ${isCompany ? 'company' : 'driver'} account has been successfully created on <strong>dispatchCore</strong>.</p>

    <div class="highlight-box">
      <p><strong>Account Type:</strong> ${isCompany ? 'Dispatcher / Company' : 'Driver'}</p>
      <p><strong>Email:</strong> ${email}</p>
    </div>

    ${isCompany ? `
    <p>Here's what you can do next:</p>
    <ul style="color: #d6d3d1; font-size: 15px; padding-left: 20px;">
      <li>Create and manage delivery orders</li>
      <li>Assign orders to your employed drivers</li>
      <li>List orders on the marketplace for independent drivers to bid on</li>
      <li>Track all deliveries in real time</li>
    </ul>
    ` : `
    <p>Here's what you can do next:</p>
    <ul style="color: #d6d3d1; font-size: 15px; padding-left: 20px;">
      <li>Browse available deliveries on the marketplace</li>
      <li>Place competitive bids on listed orders</li>
      <li>Manage your assigned deliveries</li>
      <li>Track your earnings and delivery history</li>
    </ul>
    `}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${dashboardLink}" class="btn">Go to Dashboard</a>
    </div>

    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p style="color: #78716c; font-size: 13px;">Happy delivering — The dispatchCore Team</p>
  `;

  return { subject, html: baseLayout(`Welcome, ${name}`, body) };
};

module.exports = welcomeTemplate;
