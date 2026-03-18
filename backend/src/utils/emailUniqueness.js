/**
 * Email Uniqueness Guard
 *
 * Checks that an email address is not already used by any Driver or Company.
 * Extracted to a shared utility to eliminate duplication across controllers.
 *
 * @param {string} email - Email address to check (should already be trimmed/lowercased)
 * @param {object} [exclude] - Optional IDs to exclude from the check (for updates)
 * @param {number} [exclude.driverId] - Exclude this driver from the collision check
 * @param {number} [exclude.companyId] - Exclude this company from the collision check
 * @throws {ConflictError} If the email is already in use
 */

const { Driver, Company } = require('../models');
const { ConflictError } = require('./errors');

async function ensureEmailAvailable(email, { driverId, companyId } = {}) {
  const existingDriver = await Driver.findOne({ where: { email } });
  if (existingDriver && existingDriver.id !== driverId) {
    throw new ConflictError('A driver with this email already exists');
  }

  const existingCompany = await Company.findOne({ where: { email } });
  if (existingCompany && existingCompany.id !== companyId) {
    throw new ConflictError('This email is already used by a company account');
  }
}

module.exports = { ensureEmailAvailable };
