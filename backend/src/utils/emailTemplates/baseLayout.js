/**
 * Base Email Layout
 *
 * Provides a responsive HTML wrapper shared by all email templates.
 * Modern design with improved typography, spacing, and visual hierarchy.
 *
 * @param {string} title - Email title (shown in header)
 * @param {string} bodyContent - Inner HTML content
 * @returns {string} Complete HTML email string
 */
const baseLayout = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #0f0e0d 0%, #1a1815 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
      color: #e7e5e4;
      line-height: 1.6;
      min-height: 100vh;
    }
    .email-wrapper {
      width: 100%;
      padding: 60px 20px;
      background: linear-gradient(135deg, #0f0e0d 0%, #1a1815 100%);
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #191717;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 1px rgba(251, 146, 60, 0.3);
      border: 1px solid rgba(251, 146, 60, 0.15);
    }
    .email-header {
      background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
      padding: 48px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      transform: translate(80px, -80px);
    }
    .email-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      transform: translate(-50px, 50px);
    }
    .email-header-content {
      position: relative;
      z-index: 1;
    }
    .email-header .brand {
      color: rgba(12, 10, 9, 0.8);
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 12px;
      display: block;
    }
    .email-header h1 {
      margin: 0;
      color: white;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    .email-body {
      padding: 48px 40px;
    }
    .email-body p {
      margin: 0 0 20px;
      font-size: 15px;
      color: #d6d3d1;
      line-height: 1.7;
    }
    .email-body p strong {
      color: #e7e5e4;
      font-weight: 600;
    }
    .email-body a {
      color: #fb923c;
      text-decoration: none;
    }
    .email-body ul {
      list-style: none;
      padding: 0;
      margin: 24px 0;
    }
    .email-body ul li {
      padding: 12px 0 12px 28px;
      font-size: 15px;
      color: #d6d3d1;
      line-height: 1.6;
      position: relative;
      border-left: 2px solid #fb923c;
      margin-left: 0;
    }
    .email-body ul li::before {
      content: '✓';
      position: absolute;
      left: -10px;
      color: #fb923c;
      font-weight: 700;
      font-size: 16px;
    }
    .highlight-box {
      background: linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(249, 115, 22, 0.04) 100%);
      border: 1px solid rgba(251, 146, 60, 0.2);
      border-left: 3px solid #fb923c;
      padding: 24px;
      margin: 28px 0;
      border-radius: 12px;
    }
    .highlight-box p {
      margin: 8px 0;
      font-size: 15px;
      color: #d6d3d1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .highlight-box strong {
      color: #fb923c;
      font-weight: 600;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 12px 0;
    }
    .info-label {
      color: #9ca3af;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      color: #e7e5e4;
      font-weight: 600;
      font-size: 15px;
    }
    .btn {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
      color: #0c0a09 !important;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      margin: 8px 0;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      box-shadow: 0 8px 20px rgba(251, 146, 60, 0.3);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(251, 146, 60, 0.4);
    }
    .btn-secondary {
      background: rgba(251, 146, 60, 0.1);
      color: #fb923c !important;
      border: 2px solid rgba(251, 146, 60, 0.3);
      box-shadow: none;
    }
    .btn-secondary:hover {
      background: rgba(251, 146, 60, 0.15);
      border-color: rgba(251, 146, 60, 0.5);
    }
    .btn-center {
      text-align: center;
      margin: 36px 0;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-left: auto;
    }
    .status-accepted {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
    }
    .status-rejected {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }
    .status-pending {
      background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
      color: #0c0a09;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.2), transparent);
      margin: 32px 0;
    }
    .email-footer {
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      background: rgba(251, 146, 60, 0.02);
    }
    .email-footer p {
      margin: 8px 0;
      font-size: 12px;
      color: #78716c;
      line-height: 1.6;
    }
    .email-footer .social-links {
      margin: 16px 0;
    }
    .email-footer a {
      color: #fb923c;
      text-decoration: none;
      margin: 0 8px;
      font-size: 12px;
    }
    .code-block {
      background: #0c0a09;
      border: 1px solid rgba(251, 146, 60, 0.2);
      border-radius: 8px;
      padding: 12px 16px;
      margin: 16px 0;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      color: #fb923c;
      word-break: break-all;
      overflow-x: auto;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #e7e5e4;
      margin: 24px 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid rgba(251, 146, 60, 0.2);
    }
    @media (max-width: 640px) {
      .email-wrapper { padding: 20px 10px; }
      .email-container { border-radius: 12px; }
      .email-header { padding: 32px 24px; }
      .email-body { padding: 24px; }
      .email-footer { padding: 20px 24px; }
      .email-header h1 { font-size: 24px; }
      .highlight-box { padding: 16px; }
      .info-row { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <div class="email-header-content">
          <span class="brand">dispatchCore</span>
          <h1>${title}</h1>
        </div>
      </div>
      <div class="email-body">
        ${bodyContent}
      </div>
      <div class="email-footer">
        <p style="color: #e7e5e4; font-weight: 600; margin-bottom: 8px;">dispatchCore</p>
        <p>Real-time delivery management for last-mile logistics</p>
        <p>&copy; ${new Date().getFullYear()} dispatchCore. All rights reserved.</p>
        <div class="social-links">
          <a href="https://dispatchcore.tech">Website</a> • 
          <a href="https://dispatchcore.tech/docs">Documentation</a> • 
          <a href="https://dispatchcore.tech/contact">Support</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

module.exports = baseLayout;
