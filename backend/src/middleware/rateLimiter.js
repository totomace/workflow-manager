const rateLimit = require('express-rate-limit');

/**
 * @typedef {Object} RateLimiterOptions
 * @property {number} windowMs - Time window in milliseconds
 * @property {number} max - Maximum requests per window
 * @property {string} message - Error message
 * @property {string} [code='RATE_LIMIT_EXCEEDED'] - Error code for client handling
 */

/**
 * Create a rate limiter with common configuration
 * @param {RateLimiterOptions} options - Rate limiter options
 * @returns {import('express').RequestHandler} Express middleware
 */
function createRateLimiter({ windowMs, max, message, code = 'RATE_LIMIT_EXCEEDED' }) {
  return rateLimit({
    windowMs,
    max,
    message: { error: message, code },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Custom key generator - use IP + user agent for better identification
    /**
     * @param {import('express').Request} req
     * @returns {string}
     */
    keyGenerator: (req) => {
      const ip = req.ip || req.connection?.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent') || 'unknown';
      return `${ip}:${userAgent}`;
    },
    // Handler for when rate limit is exceeded
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {Function} next
     * @param {Object} options
     */
    handler: (req, res, next, options) => {
      res.status(429).json({
        error: options.message.error,
        code: options.message.code,
        retryAfter: Math.ceil(options.windowMs / 1000),
      });
    },
    // Skip successful requests from counting (only count errors)
    // skipSuccessfulRequests: false, // Count all requests
    // Skip failed requests from counting
    // skipFailedRequests: false,
  });
}

// Strict rate limiter for auth endpoints that modify state (login, register, password changes)
// 5 requests per minute per IP
const authStrictLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Quá nhiều yêu cầu đăng nhập/đăng ký. Vui lòng thử lại sau 1 phút.',
  code: 'AUTH_RATE_LIMIT_EXCEEDED',
});

// Moderate rate limiter for token refresh
// 10 requests per minute per IP
const authRefreshLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Quá nhiều yêu cầu làm mới token. Vui lòng thử lại sau 1 phút.',
  code: 'REFRESH_RATE_LIMIT_EXCEEDED',
});

// General API rate limiter for other auth endpoints (logout, etc.)
// 30 requests per minute per IP
const authGeneralLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.',
  code: 'RATE_LIMIT_EXCEEDED',
});

// Global API rate limiter (applied to all /api routes)
// 100 requests per minute per IP
const globalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Quá nhiều yêu cầu API. Vui lòng thử lại sau 1 phút.',
  code: 'API_RATE_LIMIT_EXCEEDED',
});

module.exports = {
  createRateLimiter,
  authStrictLimiter,
  authRefreshLimiter,
  authGeneralLimiter,
  globalApiLimiter,
};