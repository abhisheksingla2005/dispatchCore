/**
 * Order Assigned Template
 *
 * Sent to a driver when an order is directly assigned to them
 * by a dispatcher or the auto-assignment system.
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
  const subject = `New Delivery Assignment — Order #${orderId}`;

  const body = `
    <p>Hi ${driverName},</p>
    <p>You have been assigned a new delivery order. Here are the details:</p>
    <div class="highlight-box">
      <p><strong>Order:</strong> #${orderId}</p>
      <p><strong>Pickup:</strong> ${pickupAddress}</p>
      <p><strong>Drop-off:</strong> ${deliveryAddress}</p>
    </div>
    <p>Please head to your dashboard to review the full details and begin the delivery.</p>
    ${dashboardLink ? `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${dashboardLink}" class="btn">Open Dashboard</a>
    </div>
    ` : ''}
  `;

  return { subject, html: baseLayout('New Delivery Assignment', body) };
};

module.exports = orderAssignedTemplate;
