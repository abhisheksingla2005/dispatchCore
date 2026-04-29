/**
 * Base Email Layout
 *
 * Provides a responsive HTML wrapper shared by all email templates.
 * Accepts a title and body HTML content block.
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
    body {
      margin: 0;
      padding: 0;
      background-color: #1c1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e7e5e4;
      line-height: 1.6;
    }
    .email-wrapper {
      width: 100%;
      padding: 40px 0;
      background-color: #1c1a1a;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #191717;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      border: 1px solid #222018;
    }
    .email-header {
      background: linear-gradient(135deg, #1c1a1a 0%, #222018 100%);
      padding: 32px 40px;
      text-align: center;
      border-bottom: 1px solid #222018;
    }
    .email-header h1 {
      margin: 0;
      color: #e7e5e4;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }
    .email-header .brand {
      color: #fb923c;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
      display: block;
    }
    .email-body {
      padding: 40px;
    }
    .email-body p {
      margin: 0 0 16px;
      font-size: 15px;
      color: #d6d3d1;
    }
    .email-body .highlight-box {
      background-color: #222018;
      border-left: 4px solid #fb923c;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .email-body .highlight-box p {
      margin: 4px 0;
      font-size: 14px;
    }
    .email-body .highlight-box strong {
      color: #e7e5e4;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
      color: #0c0a09 !important;
      text-decoration: none;
      border-radius: 999px;
      font-weight: 700;
      font-size: 15px;
      margin: 8px 0;
      transition: transform 0.2s ease;
    }
    .btn:hover {
      transform: scale(1.02);
    }
    .email-footer {
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #222018;
    }
    .email-footer p {
      margin: 0;
      font-size: 12px;
      color: #78716c;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-accepted { background-color: #22c55e; color: #0c0a09; }
    .status-rejected { background-color: #ef4444; color: #fafafa; }
    .status-pending  { background-color: #fb923c; color: #0c0a09; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <span class="brand">dispatchCore</span>
        <h1>${title}</h1>
      </div>
      <div class="email-body">
        ${bodyContent}
      </div>
      <div class="email-footer">
        <p>&copy; ${new Date().getFullYear()} dispatchCore. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

module.exports = baseLayout;
