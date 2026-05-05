/**
 * Order Tracking Template
 *
 * Sent to a recipient/customer with a tracking link for their delivery.
 * Modern design with clear delivery information and tracking CTA.
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
  const subject = `Track Your Delivery - ${trackingCode}`;

  const body = `
    <p>Hi ${recipientName || 'there'},</p>
    <p>Your delivery is on the way. Use the tracking link below to monitor your package in real time and get live updates about its location and estimated arrival.</p>
    
    <div class="highlight-box">
      <div class="info-row">
        <div style="width: 100%;">
          <p class="info-label">Tracking Code</p>
          <p class="info-value">${trackingCode}</p>
        </div>
      </div>
      ${pickupAddress ? `
      <div class="info-row">
        <div style="width: 100%;">
          <p class="info-label">Pickup Location</p>
          <p class="info-value" style="color: #d6d3d1; font-weight: 400;">${pickupAddress}</p>
        </div>
      </div>
      ` : ''}
      ${deliveryAddress ? `
      <div class="info-row">
        <div style="width: 100%;">
          <p class="info-label">Delivery Address</p>
          <p class="info-value" style="color: #d6d3d1; font-weight: 400;">${deliveryAddress}</p>
        </div>
      </div>
      ` : ''}
    </div>
    
    <div class="btn-center">
      <a href="${trackingUrl}" class="btn">Track Your Delivery</a>
    </div>

    <div class="divider"></div>

    <p style="font-size: 13px; color: #78716c;">
      You can also visit our tracking page directly and enter your tracking code to monitor your delivery status anytime.
    </p>
  `;

  return { subject, html: baseLayout('Your Delivery is On the Way', body) };
};

module.exports = orderTrackingTemplate;
