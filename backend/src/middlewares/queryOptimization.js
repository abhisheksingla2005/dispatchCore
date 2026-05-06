/**
 * Query optimization middleware
 * Adds intelligent pagination, caching headers, and query limits
 */

const logger = require('../config/logger');

/**
 * Parse pagination parameters from query string
 * Defaults: limit 50, offset 0. Max limit: 500
 */
function paginationMiddleware(req, res, next) {
  const limit = Math.min(parseInt(req.query.limit) || 50, 500);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);

  req.pagination = { limit, offset };
  
  // Add standard pagination headers to response
  res.set('X-Pagination-Limit', limit.toString());
  res.set('X-Pagination-Offset', offset.toString());
  
  next();
}

/**
 * Set cache headers for GET requests
 * Different strategies based on endpoint
 */
function cacheHeaderMiddleware(req, res, next) {
  if (req.method === 'GET') {
    const originalJson = res.json;

    res.json = function (data) {
      // Cache static resources longer (pricing, docs, etc)
      if (req.path.match(/\/(pricing|docs|blog|faq|terms|privacy|security|about)\b/)) {
        res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
      }
      // Cache user data for 5 minutes
      else if (req.path.match(/\/(dashboard|profile|drivers|orders)\b/)) {
        res.set('Cache-Control', 'private, max-age=300'); // 5 minutes
      }
      // Cache real-time data for 30 seconds
      else if (req.path.match(/\/(map|tracking|live)\b/)) {
        res.set('Cache-Control', 'private, max-age=30'); // 30 seconds
      }
      // No cache for auth endpoints
      else if (req.path.match(/\/(auth|login|logout|session)\b/)) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
      
      return originalJson.call(this, data);
    };
  }

  next();
}

/**
 * ETag support for cache validation
 */
function etagMiddleware(req, res, next) {
  if (req.method === 'GET') {
    const originalJson = res.json;

    res.json = function (data) {
      // Generate simple ETag from response data
      const crypto = require('crypto');
      const etag = crypto
        .createHash('md5')
        .update(JSON.stringify(data))
        .digest('hex')
        .substring(0, 8);

      res.set('ETag', `"${etag}"`);

      // Check If-None-Match header
      if (req.get('If-None-Match') === `"${etag}"`) {
        return res.status(304).end();
      }

      return originalJson.call(this, data);
    };
  }

  next();
}

/**
 * Query timeout middleware
 * Prevents long-running queries from blocking responses
 */
// eslint-disable-next-line prefer-const
function queryTimeoutMiddleware(timeout = 30000) {
  return (req, res, next) => {
    // eslint-disable-next-line prefer-const
    let timeoutHandle;

    const originalJson = res.json;
    const originalSend = res.send;

    const cleanup = () => clearTimeout(timeoutHandle);

    res.json = function (data) {
      cleanup();
      return originalJson.call(this, data);
    };

    res.send = function (data) {
      cleanup();
      return originalSend.call(this, data);
    };

    res.on('finish', cleanup);
    res.on('close', cleanup);

    timeoutHandle = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          code: 'QUERY_TIMEOUT',
          message: `Request exceeded ${timeout}ms timeout`,
        });
      }
    }, timeout);

    next();
  };
}

module.exports = {
  paginationMiddleware,
  cacheHeaderMiddleware,
  etagMiddleware,
  queryTimeoutMiddleware,
};
