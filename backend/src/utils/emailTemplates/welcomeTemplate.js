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
      <div class="info-row">
        <div>
          <p class="info-label">Account Type</p>
          <p class="info-value">${isCompany ? 'Dispatcher / Company' : 'Driver'}</p>
        </div>
      </div>
      <div class="info-row">
        <div style="width: 100%;">
          <p class="info-label">Email Address</p>
          <p class="info-value">${email}</p>
        </div>
      </div>
    </div>

    <div class="section-title">What You Can Do Next</div>
    <ul>
      ${isCompany ? `
        <li>Create and manage delivery orders from your dashboard</li>
        <li>Assign orders to your employed drivers automatically</li>
        <li>List orders on the marketplace for independent drivers</li>
        <li>Track all deliveries in real time with live updates</li>
        <li>Generate detailed analytics and performance reports</li>
      ` : `
        <li>Browse available deliveries on the marketplace</li>
        <li>Place competitive bids on listed orders</li>
        <li>Manage your assigned and accepted deliveries</li>
        <li>Track your earnings and delivery history</li>
        <li>Build your reputation with successful deliveries</li>
      `}
    </ul>

    <div class="btn-center">
      <a href="${dashboardLink}" class="btn">Go to Dashboard</a>
    </div>

    <div class="divider"></div>
    
    <p style="font-size: 14px; margin-bottom: 12px;">Need help getting started?</p>
    <p style="font-size: 13px; color: #78716c; margin: 0;">
      Check out our <a href="https://dispatchcore.tech/docs" style="color: #fb923c;">documentation</a> or 
      reach out to our <a href="https://dispatchcore.tech/contact" style="color: #fb923c;">support team</a> anytime.
    </p>
    <p style="color: #78716c; font-size: 13px; margin-top: 16px;">Happy delivering — The dispatchCore Team</p>
  `;

  return { subject, html: baseLayout(`Welcome, ${name}`, body) };
};

module.exports = welcomeTemplate;
