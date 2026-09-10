/**
 * Centralized Error Handling for TaskFlow API
 *
 * This module provides:
 * - Custom error classes for different error types
 * - Global error handler middleware
 * - Async wrapper to avoid try-catch in controllers
 */

// ============================================
// Type Definitions
// ============================================

/**
 * @typedef {Object} ErrorDetails
 * @property {string} [dbCode] - Database error code
 * @property {string} [detail] - Additional error detail
 * @property {number} [retryAfter] - Seconds until retry allowed
 * @property {Array} [errors] - Validation errors
 * @property {*} [originalError] - Original error object
 */

/**
 * @typedef {Object} ErrorLogContext
 * @property {string} code - Error code
 * @property {string} message - Error message
 * @property {number} statusCode - HTTP status code
 * @property {string} path - Request path
 * @property {string} method - HTTP method
 * @property {string} ip - Client IP
 * @property {string} userAgent - Client user agent
 * @property {number} [userId] - Authenticated user ID
 * @property {string} [stack] - Error stack trace
 * @property {ErrorDetails} [details] - Additional error details
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for errors
 * @property {Object} error
 * @property {string} error.message - Error message
 * @property {string} error.code - Error code
 * @property {ErrorDetails} [error.details] - Additional details (dev only)
 * @property {number} [error.retryAfter] - Seconds until retry (rate limit)
 */

// ============================================
// Custom Error Classes
// ============================================

/**
 * Base application error class
 * @extends Error
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {string} [code='INTERNAL_ERROR'] - Error code
   * @param {ErrorDetails} [details=null] - Additional error details
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // Expected errors vs programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400)
 * @extends AppError
 */
class ValidationError extends AppError {
  /**
   * @param {string} message - Error message
   * @param {ErrorDetails} [details=null] - Validation details
   */
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Authentication error (401)
 * @extends AppError
 */
class AuthenticationError extends AppError {
  /**
   * @param {string} [message='Authentication required'] - Error message
   */
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Authorization error (403)
 * @extends AppError
 */
class AuthorizationError extends AppError {
  /**
   * @param {string} [message='Access denied'] - Error message
   */
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Not found error (404)
 * @extends AppError
 */
class NotFoundError extends AppError {
  /**
   * @param {string} [message='Resource not found'] - Error message
   */
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * Conflict error (409)
 * @extends AppError
 */
class ConflictError extends AppError {
  /**
   * @param {string} [message='Resource conflict'] - Error message
   */
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

/**
 * Rate limit error (429)
 * @extends AppError
 */
class RateLimitError extends AppError {
  /**
   * @param {string} [message='Too many requests'] - Error message
   * @param {number} [retryAfter=60] - Seconds until retry
   */
  constructor(message = 'Too many requests', retryAfter = 60) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfter });
  }
}

/**
 * Database error (500)
 * @extends AppError
 */
class DatabaseError extends AppError {
  /**
   * @param {string} [message='Database error'] - Error message
   * @param {Error} [originalError=null] - Original database error
   */
  constructor(message = 'Database error', originalError = null) {
    super(message, 500, 'DATABASE_ERROR', originalError?.code ? { dbCode: originalError.code } : null);
  }
}

// ============================================
// Error Code Mapping (PostgreSQL specific)
// ============================================

/**
 * @typedef {Object} PgErrorMapping
 * @property {number} statusCode - HTTP status code
 * @property {string} code - Error code
 * @property {string} message - Error message
 */

/** @type {Object.<string, PgErrorMapping>} */
const PG_ERROR_CODES = {
  '23505': { statusCode: 409, code: 'DUPLICATE_ENTRY', message: 'Duplicate entry. This record already exists.' },
  '23503': { statusCode: 400, code: 'FOREIGN_KEY_VIOLATION', message: 'Referenced resource does not exist.' },
  '23502': { statusCode: 400, code: 'NOT_NULL_VIOLATION', message: 'Required field is missing.' },
  '22001': { statusCode: 400, code: 'DATA_TOO_LONG', message: 'Input data is too long.' },
  '42703': { statusCode: 500, code: 'UNDEFINED_COLUMN', message: 'Database schema error.' },
  '42P01': { statusCode: 500, code: 'UNDEFINED_TABLE', message: 'Database table not found.' },
  '28000': { statusCode: 500, code: 'DB_AUTH_FAILED', message: 'Database authentication failed.' },
  '08006': { statusCode: 503, code: 'DB_CONNECTION_FAILED', message: 'Database connection failed.' },
};

// ============================================
// Error Normalization
// ============================================

/**
 * Normalize any error to AppError
 * @param {Error} err - Original error
 * @returns {AppError} Normalized error
 */
function normalizeError(err) {
  // Already an AppError
  if (err instanceof AppError) {
    return err;
  }

  // PostgreSQL errors
  if (err.code && PG_ERROR_CODES[err.code]) {
    const pgErr = PG_ERROR_CODES[err.code];
    return new AppError(pgErr.message, pgErr.statusCode, pgErr.code, { dbCode: err.code, detail: err.detail });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }

  // Validation errors (Zod, Joi, etc.)
  if (err.name === 'ZodError' || err.name === 'ValidationError') {
    return new ValidationError('Validation failed', err.errors || err.details);
  }

  // Syntax errors (JSON parse, etc.)
  if (err instanceof SyntaxError) {
    return new ValidationError('Invalid JSON format');
  }

  // Default to internal server error
  return new AppError(
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500,
    'INTERNAL_ERROR'
  );
}

// ============================================
// Async Wrapper
// ============================================

/**
 * Wrap async route handlers to automatically catch errors
 * Eliminates need for try-catch in every controller
 * @template T
 * @param {Function} fn - Async route handler
 * @returns {import('express').RequestHandler} Express middleware
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ============================================
// Global Error Handler Middleware
// ============================================

/**
 * Global error handling middleware
 * Must be registered last in Express app
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {void}
 */
function errorHandler(err, req, res, next) {
  // Normalize error
  /** @type {import('./errorHandler').AppError} */
  const normalizedErr = normalizeError(err);

  // Log error (in production, use proper logger like Winston/Pino)
  /** @type {'error' | 'warn'} */
  const logLevel = normalizedErr.statusCode >= 500 ? 'error' : 'warn';
  console[logLevel]('API Error:', {
    code: normalizedErr.code,
    message: normalizedErr.message,
    statusCode: normalizedErr.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    stack: normalizedErr.stack,
    details: normalizedErr.details,
  });

  // Build response
  /** @type {ErrorResponse} */
  const response = {
    success: false,
    error: {
      message: normalizedErr.message,
      code: normalizedErr.code,
    },
  };

  // Include details in development
  if (process.env.NODE_ENV !== 'production' && normalizedErr.details) {
    response.error.details = normalizedErr.details;
  }

  // Include retryAfter for rate limit errors
  if (normalizedErr.code === 'RATE_LIMIT_EXCEEDED' && normalizedErr.details?.retryAfter) {
    response.error.retryAfter = normalizedErr.details.retryAfter;
  }

  // Set retry-after header for 429
  if (normalizedErr.statusCode === 429 && normalizedErr.details?.retryAfter) {
    res.set('Retry-After', normalizedErr.details.retryAfter.toString());
  }

  res.status(normalizedErr.statusCode).json(response);
}

// ============================================
// 404 Handler (for unmatched routes)
// ============================================

/**
 * 404 handler for unmatched routes
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {void}
 */
function notFoundHandler(req, res, next) {
  const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
  next(error);
}

// ============================================
// Export
// ============================================

module.exports = {
  // Error classes
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,

  // Utilities
  normalizeError,
  asyncHandler,
  errorHandler,
  notFoundHandler,

  // Constants
  PG_ERROR_CODES,
};