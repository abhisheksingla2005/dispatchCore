/**
 * Email Quota Service
 *
 * Tracks and enforces Resend free tier email limits:
 * - 3,000 emails per month
 * - 100 emails per day
 *
 * Prevents billing by blocking emails when limits are exceeded.
 * Logs quota status and alerts when approaching limits (80%+).
 */

const logger = require('../config/logger');
const { EmailQuotaTracking } = require('../models');

const DAILY_LIMIT = 100;
const MONTHLY_LIMIT = 3000;
const WARNING_THRESHOLD = 0.8; // Alert at 80% of limit

/**
 * Get today's date in UTC (midnight)
 * @returns {Date}
 */
const getTodayUTC = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

/**
 * Get current month as YYYY-MM
 * @returns {string}
 */
const getCurrentMonthYear = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Get or create today's quota record
 * @returns {Promise<object>} EmailQuotaTracking record
 */
const getTodayQuota = async () => {
  const today = getTodayUTC();
  const monthYear = getCurrentMonthYear();

  let record = await EmailQuotaTracking.findOne({
    where: { date: today },
  });

  if (!record) {
    record = await EmailQuotaTracking.create({
      date: today,
      monthYear,
      dailyCount: 0,
      monthlyCount: 0,
    });
  }

  return record;
};

/**
 * Check if an email can be sent without exceeding quotas
 * @param {string} emailType - Type of email (verification, bid, etc) for logging
 * @returns {Promise<{allowed: boolean, reason: string|null, dailyUsage: number, monthlyUsage: number}>}
 */
const checkQuota = async (emailType = 'unknown') => {
  try {
    const quota = await getTodayQuota();

    const dailyRemaining = DAILY_LIMIT - quota.dailyCount;
    const monthlyRemaining = MONTHLY_LIMIT - quota.monthlyCount;

    // Check hard limits
    if (quota.dailyCount >= DAILY_LIMIT) {
      logger.error(
        {
          dailyCount: quota.dailyCount,
          dailyLimit: DAILY_LIMIT,
          emailType,
        },
        'Daily email quota exceeded',
      );
      return {
        allowed: false,
        reason: `Daily limit reached (${DAILY_LIMIT}/day)`,
        dailyUsage: quota.dailyCount,
        monthlyUsage: quota.monthlyCount,
      };
    }

    if (quota.monthlyCount >= MONTHLY_LIMIT) {
      logger.error(
        {
          monthlyCount: quota.monthlyCount,
          monthlyLimit: MONTHLY_LIMIT,
          emailType,
        },
        'Monthly email quota exceeded',
      );
      return {
        allowed: false,
        reason: `Monthly limit reached (${MONTHLY_LIMIT}/month)`,
        dailyUsage: quota.dailyCount,
        monthlyUsage: quota.monthlyCount,
      };
    }

    // Warn if approaching limits
    if (quota.dailyCount >= DAILY_LIMIT * WARNING_THRESHOLD) {
      logger.warn(
        {
          dailyCount: quota.dailyCount,
          dailyLimit: DAILY_LIMIT,
          percentUsed: Math.round((quota.dailyCount / DAILY_LIMIT) * 100),
        },
        'Daily email quota approaching limit',
      );
    }

    if (quota.monthlyCount >= MONTHLY_LIMIT * WARNING_THRESHOLD) {
      logger.warn(
        {
          monthlyCount: quota.monthlyCount,
          monthlyLimit: MONTHLY_LIMIT,
          percentUsed: Math.round((quota.monthlyCount / MONTHLY_LIMIT) * 100),
        },
        'Monthly email quota approaching limit',
      );
    }

    return {
      allowed: true,
      reason: null,
      dailyUsage: quota.dailyCount,
      monthlyUsage: quota.monthlyCount,
      dailyRemaining,
      monthlyRemaining,
    };
  } catch (error) {
    logger.error({ err: error }, 'Error checking email quota');
    // Fail open: allow email if quota check fails (don't break sending)
    return {
      allowed: true,
      reason: null,
      dailyUsage: -1,
      monthlyUsage: -1,
    };
  }
};

/**
 * Record that an email was sent (increment counters)
 * @param {string} emailType - Type of email for logging
 * @returns {Promise<void>}
 */
const recordEmailSent = async (emailType = 'unknown') => {
  try {
    const quota = await getTodayQuota();

    await quota.increment(['dailyCount', 'monthlyCount']);

    logger.debug(
      {
        dailyCount: quota.dailyCount + 1,
        monthlyCount: quota.monthlyCount + 1,
        emailType,
      },
      'Email quota recorded',
    );
  } catch (error) {
    logger.error({ err: error, emailType }, 'Error recording email quota');
    // Non-fatal: don't fail email sending if quota recording fails
  }
};

/**
 * Get current quota status
 * @returns {Promise<object>} Current usage and limits
 */
const getQuotaStatus = async () => {
  try {
    const quota = await getTodayQuota();
    return {
      daily: {
        used: quota.dailyCount,
        limit: DAILY_LIMIT,
        remaining: DAILY_LIMIT - quota.dailyCount,
        percentUsed: Math.round((quota.dailyCount / DAILY_LIMIT) * 100),
      },
      monthly: {
        used: quota.monthlyCount,
        limit: MONTHLY_LIMIT,
        remaining: MONTHLY_LIMIT - quota.monthlyCount,
        percentUsed: Math.round((quota.monthlyCount / MONTHLY_LIMIT) * 100),
      },
      lastUpdated: quota.updatedAt,
    };
  } catch (error) {
    logger.error({ err: error }, 'Error getting quota status');
    return null;
  }
};

module.exports = {
  checkQuota,
  recordEmailSent,
  getQuotaStatus,
  DAILY_LIMIT,
  MONTHLY_LIMIT,
  WARNING_THRESHOLD,
};
