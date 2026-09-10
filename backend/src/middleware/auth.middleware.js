const jwt = require('jsonwebtoken');
const { getJwtSecret, getJwtVerifyOptions } = require('../config/jwt');

/**
 * @typedef {Object} JwtPayload
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {number} [iat] - Issued at timestamp
 * @property {number} [exp] - Expiration timestamp
 */

/**
 * @typedef {Object} AuthenticatedRequest
 * @property {JwtPayload} user - Authenticated user payload
 * @property {Object} headers - Request headers
 */

/**
 * Express middleware for JWT authentication
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
module.exports = (req, res, next) => {
  /** @type {string | undefined} */
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  /** @type {string} */
  const token = authHeader.split(' ')[1];

  try {
    /** @type {JwtPayload} */
    const decoded = jwt.verify(token, getJwtSecret(), getJwtVerifyOptions());
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};