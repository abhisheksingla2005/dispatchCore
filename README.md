# <img src="logo.png" alt="" width="32" /> dispatchCore

## The Problem

Last-mile delivery — the final leg from a local hub to the customer's door — is the most expensive and disorganized part of any logistics chain. It accounts for over half of total shipping costs, yet most small and mid-sized courier companies still coordinate their entire operation through phone calls, WhatsApp groups, and guesswork.

The consequences are real:

- **Drivers sit idle** while unassigned orders pile up nearby.
- **Orders get double-assigned**, sending two drivers to the same pickup.
- **Customers have no visibility** into where their package actually is.
- **Dispatchers operate blind**, making decisions without real-time data.
- **No performance tracking** means inefficiencies go unnoticed and unresolved.

Large enterprises build internal control towers to solve this. Small businesses can't afford to. They're left with chaos.

## What dispatchCore Does

dispatchCore replaces the manual, fragmented dispatch process with a single, synchronized platform where dispatchers, drivers, and customers all operate from the same real-time source of truth.

### For Dispatchers
A live control dashboard where they can see every driver, every order, and every delivery status — all updating in real time. Dispatchers can assign deliveries directly to their employed drivers or list orders on a public marketplace for independent drivers to pick up. In-app messaging keeps communication centralized per-order.

### For Employed Drivers
A clean, focused interface showing their assigned delivery queue, navigation, and simple status controls. Auto-refreshing dashboard keeps data in sync with dispatcher changes. They stay connected to their company's dispatch system at all times.

### For Independent Drivers
A gig-economy marketplace where freelance drivers can browse available deliveries, bid on the ones that match their route, and even pre-register their upcoming travel plans so dispatchers can proactively match them with packages heading the same direction. Earnings are tracked per-delivery with daily and weekly summaries.

### For Customers
A live tracking page — no login required — showing exactly where their package is and when it will arrive.

### For Platform Administrators
Full oversight of the entire system, managing companies, resolving disputes, and monitoring platform-wide health.

## Built for Multiple Companies

dispatchCore is a multi-tenant platform. Each delivery company that signs up gets their own isolated workspace. Company A cannot see Company B's warehouses, drivers, orders, or analytics — and vice versa.

However, independent drivers are shared across the entire platform. When any company lists a delivery on the marketplace, freelance drivers from across dispatchCore can see it and bid. Once an independent driver picks up a delivery, only that specific company's dispatchers and the end customer can track them.

A platform-level SuperAdmin has full visibility across all companies to manage the system, onboard new businesses, and resolve disputes.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Maps** | MapLibre GL JS + react-map-gl |
| **Icons** | Lucide React |
| **UI Primitives** | Radix UI |
| **Backend** | Node.js, Express 4 |
| **Database** | MySQL (Sequelize ORM) |
| **Real-Time** | Firebase Realtime Database |
| **Email** | Nodemailer (SMTP) |
| **Security** | Helmet, express-rate-limit, express-validator |


## Technical Architecture

### Concurrent Assignment Prevention
Two dispatchers assigning the same order simultaneously would cause double-assignment. The assignment service uses Sequelize SERIALIZABLE transactions with pessimistic row locking (`SELECT ... FOR UPDATE`) — the second transaction blocks until the first commits, then fails with a 409 conflict rather than silently creating a duplicate assignment.

### Real-Time Events via Firebase
Firebase Realtime Database powers all live updates — driver GPS pings, order status changes, assignment notifications, and marketplace bid updates. Events are written to Firebase paths like `/drivers/{id}/location` and `/orders/{id}/status`, with clients subscribing to relevant paths for instant updates.

### Multi-Tenant Data Isolation
Every table in the schema chains back to `company_id`. A `tenantResolver` middleware extracts the company scope from request headers and injects it into every query — Company A cannot read or write Company B's orders, drivers, or assignments.


## Who Is This For

- Local and regional courier companies
- Last-mile delivery startups
- Businesses that rely on both full-time and freelance drivers
- Any delivery operation that has outgrown spreadsheets and WhatsApp coordination

## Documentation

- [System Design](docs/system_design.md) — Architecture, database, API design, UML diagrams
- [Infrastructure](docs/infrastructure.md) — Conventions, patterns, and engineering standards

## Getting Started

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run dev        # → http://localhost:8000

# Production backend runtime (Render)
npm start          # do not use npm run dev in production

# Frontend
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

## Auth Model

- Primary mode: HttpOnly JWT cookies (`accessToken`, `refreshToken`).
- Fallback mode: Bearer token headers for browsers/environments that block third-party cookies.
- Frontend sends `credentials: include` and can transparently refresh expired access tokens.

## Production Notes

- Render Start Command: `npm start` (or `npm run start:prod`).
- Do not use `npm run dev` on Render; `nodemon` is dev-only.
- Ensure `FRONTEND_URL` exactly matches your deployed frontend origin.
- Set strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in backend env.
- Run `npm run db:migrate` during release before serving traffic.
- **Email (SMTP)**: Configure SMTP credentials for transactional emails. On Render, use port 587 with `SMTP_SECURE=false` (STARTTLS) and `family: 4` (IPv4 only).

## The Vision

dispatchCore is designed to grow. The foundation being built today is architected to support future capabilities like AI-powered route optimization, demand forecasting, predictive driver scheduling, and automated dispatch — transforming it from a coordination tool into an intelligent logistics engine.
