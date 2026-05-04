/**
 * Admin Email Quota Controller
 *
 * Provides monitoring endpoints for email quota status.
 * Accessible only to superadmins.
 */

const logger = require('../../config/logger');
const { getQuotaStatus } = require('../../services/emailQuotaService');

/**
 * GET /api/admin/email/quota
 * Get current email quota status
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getEmailQuotaStatus = async (req, res, next) => {
  try {
    const status = await getQuotaStatus();

    if (!status) {
      return res.status(500).json({
        error: 'Failed to retrieve quota status',
      });
    }

    res.json(status);
  } catch (error) {
    logger.error({ err: error }, 'Error retrieving email quota status');
    next(error);
  }
};

module.exports = {
  getEmailQuotaStatus,
};
