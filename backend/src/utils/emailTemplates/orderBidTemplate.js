/**
 * Order Bid Template
 *
 * Sent to a driver when their bid status changes (accepted/rejected)
 * or to a company when a new bid is received.
 *
 * @param {object} params
 * @param {string} params.driverName - Driver display name
 * @param {number|string} params.orderId - Order ID
 * @param {number|string} params.bidAmount - Bid offered price
 * @param {'ACCEPTED'|'REJECTED'|'PENDING'} params.status - Bid status
 * @param {string} [params.dashboardLink] - Link to view bid details
 * @returns {{ subject: string, html: string }}
 */
const baseLayout = require('./baseLayout');

const STATUS_LABELS = {
  ACCEPTED: { label: 'Accepted', cssClass: 'status-accepted', emoji: '🎉' },
  REJECTED: { label: 'Rejected', cssClass: 'status-rejected', emoji: '' },
  PENDING:  { label: 'Pending',  cssClass: 'status-pending',  emoji: '📩' },
};

const orderBidTemplate = ({ driverName, orderId, bidAmount, status, dashboardLink }) => {
  const statusInfo = STATUS_LABELS[status] || STATUS_LABELS.PENDING;
  const subject = `Bid ${statusInfo.label} ${statusInfo.emoji} — Order #${orderId}`;

  const body = `
    <p>Hi ${driverName},</p>
    <p>Your bid for <strong>Order #${orderId}</strong> has been updated.</p>
    <div class="highlight-box">
      <p><strong>Order:</strong> #${orderId}</p>
      <p><strong>Bid Amount:</strong> $${bidAmount}</p>
      <p><strong>Status:</strong> <span class="${statusInfo.cssClass} status-badge">${statusInfo.label}</span></p>
    </div>
    ${status === 'ACCEPTED' ? `
    <p>Congratulations! Head to your dashboard to view the assignment details and begin the delivery.</p>
    ` : ''}
    ${status === 'REJECTED' ? `
    <p>Unfortunately, your bid was not selected for this delivery. Keep an eye on the marketplace for new opportunities.</p>
    ` : ''}
    ${dashboardLink ? `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${dashboardLink}" class="btn">View Dashboard</a>
    </div>
    ` : ''}
  `;

  return { subject, html: baseLayout(`Bid ${statusInfo.label}`, body) };
};

module.exports = orderBidTemplate;
