# Tracking Email on Order Creation — Design

## Summary
Send the recipient tracking email immediately after order creation and remove the tracking-link UI. Only one tracking email will be sent (no pickup-time email) to avoid duplicates and excess quota usage.

## Architecture & Data Flow
- **Backend:** In `POST /api/orders`, after `Order.create`, call `mailService.sendTrackingEmail(order)` when `recipient_email` is present. Keep existing Resend quota enforcement and idempotency in `mailService`.
- **Backend (status updates):** Remove the pickup-time tracking email send in `updateOrderStatus` to prevent duplicates.
- **Frontend:** Remove tracking link UI and `createdTrackingLink` state in dispatcher **dashboard** and **orders** pages. Replace with a simple “Order created, tracking email sent” confirmation.

## Error Handling & Edge Cases
- If `recipient_email` is missing, skip the email and still create the order.
- If Resend fails, log the error and do **not** block order creation.
- Idempotency keys prevent duplicate tracking emails on retries.

## UI/UX
- No tracking link displayed to dispatcher after creation.
- Simple success confirmation in both dispatcher pages.

## Testing
- Run frontend build to ensure TS/types pass.
- No new backend tests required if none exist; rely on runtime logging for email send failures.
