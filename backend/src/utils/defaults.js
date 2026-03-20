/**
 * Default Preferences
 *
 * Canonical default values for notification and appearance preferences.
 * Used when creating new drivers and companies to ensure consistency.
 *
 * Driver and company controllers both reference these instead of
 * maintaining their own copies.
 */

/** @type {Record<string, boolean>} Default notification preferences for drivers */
const DRIVER_NOTIFICATION_DEFAULTS = Object.freeze({
  new_job_alerts: true,
  bid_updates: true,
  delivery_reminders: true,
  earnings_updates: false,
  dispatcher_messages: true,
  promotions: false,
});

/** @type {Record<string, boolean>} Default notification preferences for companies */
const COMPANY_NOTIFICATION_DEFAULTS = Object.freeze({
  bid_notifications: true,
  delivery_updates: true,
  driver_messages: true,
  daily_summary_email: false,
  driver_applications: true,
  payment_alerts: false,
});

/** @type {{ theme: string }} Default appearance preferences (shared) */
const APPEARANCE_DEFAULTS = Object.freeze({
  theme: 'system',
});

/** @type {Record<string, number>} Default vehicle capacity by type (kg) */
const VEHICLE_CAPACITY_DEFAULTS = Object.freeze({
  TRUCK: 5000,
  VAN: 1000,
  BIKE: 100,
});

module.exports = {
  DRIVER_NOTIFICATION_DEFAULTS,
  COMPANY_NOTIFICATION_DEFAULTS,
  APPEARANCE_DEFAULTS,
  VEHICLE_CAPACITY_DEFAULTS,
};
