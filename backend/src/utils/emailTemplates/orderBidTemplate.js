/**
 * Order Bid Template
 *
 * Sent to a driver when their bid status changes (accepted/rejected)
 * or to a company when a new bid is received.
 * Visual status indicators and clear next actions.
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
  ACCEPTED: { label: 'Accepted', cssClass: 'status-accepted' },
  REJECTED: { label: 'Rejected', cssClass: 'status-rejected' },
  PENDING:  { label: 'Pending',  cssClass: 'status-pending' },
};

const orderBidTemplate = ({ driverName, orderId, bidAmount, status, dashboardLink }) => {
  const statusInfo = STATUS_LABELS[status] || STATUS_LABELS.PENDING;
  const subject = `Bid ${statusInfo.label} - Order #${orderId}`;

  const body = `
    <p>Hi ${driverName},</p>
    <p>Your bid for Order #${orderId} has been updated. Here's the status:</p>
    
    <div class="highlight-box">
      <div class="info-row">
        <div>
          <p class="info-label">Order Number</p>
          <p class="info-value">#${orderId}</p>
        </div>
        <div>
          <p class="info-label">Your Bid Amount</p>
          <p class="info-value">$${bidAmount}</p>
        </div>
      </div>
      <div class="info-row">
        <div style="width: 100%;">
          <p class="info-label">Bid Status</p>
          <p style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
            <span class="${statusInfo.cssClass} status-badge">${statusInfo.label}</span>
          </p>
        </div>
      </div>
    </div>
    
    ${status === 'ACCEPTED' ? `
    <div style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2); border-left: 3px solid #22c55e; padding: 20px; margin: 24px 0; border-radius: 8px;">
      <p style="color: #22c55e; font-weight: 600; margin: 0 0 8px 0;">Congratulations!</p>
      <p style="margin: 0; color: #d6d3d1;">Your bid has been accepted. Head to your dashboard to view the complete assignment details and begin the delivery.</p>
    </div>
    ` : ''}
    
    ${status === 'REJECTED' ? `
    <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-left: 3px solid #ef4444; padding: 20px; margin: 24px 0; border-radius: 8px;">
      <p style="color: #ef4444; font-weight: 600; margin: 0 0 8px 0;">Not Selected</p>
      <p style="margin: 0; color: #d6d3d1;">Unfortunately, your bid was not selected for this delivery. Keep an eye on the marketplace for new opportunities that match your service area.</p>
    </div>
    ` : ''}
    
    ${dashboardLink ? `
    <div class="btn-center">
      <a href="${dashboardLink}" class="btn">View Dashboard</a>
    </div>
    ` : ''}
  `;

  return { subject, html: baseLayout(`Bid ${statusInfo.label}`, body) };
};

module.exports = orderBidTemplate;
