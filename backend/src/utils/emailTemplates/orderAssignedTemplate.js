/**
 * Order Assigned Template
 *
 * Sent to a driver when an order is directly assigned to them
 * by a dispatcher or the auto-assignment system.
 * Clear delivery instructions and quick action button.
 *
 * @param {object} params
 * @param {string} params.driverName - Driver display name
 * @param {number|string} params.orderId - Order ID
 * @param {string} params.pickupAddress - Pickup location address
 * @param {string} params.deliveryAddress - Delivery location address
 * @param {string} [params.dashboardLink] - Link to driver dashboard
 * @returns {{ subject: string, html: string }}
 */
const baseLayout = require('./baseLayout');

const orderAssignedTemplate = ({ driverName, orderId, pickupAddress, deliveryAddress, dashboardLink }) => {
  const subject = `New Delivery Assignment - Order #${orderId}`;

  const body = `
    <p>Hi ${driverName},</p>
    <p>You have been assigned a new delivery order. Review the details below and head to your dashboard to accept and begin the delivery.</p>
    
    <div class="highlight-box">
      <div class="info-row">
        <div style="width: 100%;">
          <p class="info-label">Order Number</p>
          <p class="info-value">#${orderId}</p>
        </div>
      </div>
      <div class="info-row">
        <div style="width: 100%;">
          <p class="info-label">Pickup Location</p>
          <p class="info-value" style="color: #d6d3d1; font-weight: 400;">${pickupAddress}</p>
        </div>
      </div>
      <div class="info-row">
        <div style="width: 100%;">
          <p class="info-label">Delivery Location</p>
          <p class="info-value" style="color: #d6d3d1; font-weight: 400;">${deliveryAddress}</p>
        </div>
      </div>
    </div>
    
    <p>Please review all details and head to your dashboard to accept this assignment. Once accepted, you can view additional instructions and begin the delivery.</p>
    
    ${dashboardLink ? `
    <div class="btn-center">
      <a href="${dashboardLink}" class="btn">Open Dashboard</a>
    </div>
    ` : ''}

    <div class="divider"></div>

    <p style="font-size: 13px; color: #78716c;">
      Questions about this delivery? Contact the dispatcher or visit your dashboard for more details.
    </p>
  `;

  return { subject, html: baseLayout('New Delivery Assignment', body) };
};

module.exports = orderAssignedTemplate;
