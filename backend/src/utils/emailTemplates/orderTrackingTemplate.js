/**
 * Order Tracking Template
 *
 * Sent to a recipient/customer with a tracking link for their delivery.
 *
 * @param {object} params
 * @param {string} params.recipientName - Customer/recipient name
 * @param {string} params.trackingCode - Unique tracking code
 * @param {string} params.trackingUrl - Full URL to live tracking page
 * @param {string} [params.pickupAddress] - Pickup location
 * @param {string} [params.deliveryAddress] - Delivery address
 * @returns {{ subject: string, html: string }}
 */
const baseLayout = require('./baseLayout');

const orderTrackingTemplate = ({ recipientName, trackingCode, trackingUrl, pickupAddress, deliveryAddress }) => {
  const subject = `Track Your Delivery — ${trackingCode}`;

  const body = `
    <p>Hi ${recipientName || 'there'},</p>
    <p>Your delivery is on the way! Use the link below to track it in real time.</p>
    <div class="highlight-box">
      <p><strong>Tracking Code:</strong> ${trackingCode}</p>
      ${pickupAddress ? `<p><strong>From:</strong> ${pickupAddress}</p>` : ''}
      ${deliveryAddress ? `<p><strong>To:</strong> ${deliveryAddress}</p>` : ''}
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${trackingUrl}" class="btn">Track Delivery</a>
    </div>
    <p style="color: #9ca3af; font-size: 13px;">If you have any questions, please contact the sender directly.</p>
  `;

  return { subject, html: baseLayout('Track Your Delivery', body) };
};

module.exports = orderTrackingTemplate;
