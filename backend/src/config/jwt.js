/**
 * JWT Configuration Module
 * Centralized JWT secret management with environment-aware validation
 */

const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Get JWT secret with proper validation
 * @returns {string} JWT secret
 * @throws {Error} If JWT_SECRET is not set in production
 */
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  // In production, JWT_SECRET MUST be set - no fallback allowed
  if (NODE_ENV === 'production') {
    if (!secret) {
      throw new Error(
        'FATAL: JWT_SECRET environment variable is required in production. ' +
        'Please set a strong random secret (min 32 characters).'
      );
    }
    if (secret.length < 32) {
      throw new Error(
        'FATAL: JWT_SECRET must be at least 32 characters in production. ' +
        'Current length: ' + secret.length
      );
    }
    // Warn if using default/example values in production
    const weakSecrets = [
      'your-super-secret-jwt-key-change-in-production',
      'change-this-secret',
      'your-secret-key',
      'secret',
      'jwt-secret'
    ];
    if (weakSecrets.includes(secret)) {
      console.warn(
        '⚠️  WARNING: JWT_SECRET appears to be a default/example value. ' +
        'Please use a strong random secret in production!'
      );
    }
    return secret;
  }

  // Development: allow fallback but warn if using default
  if (!secret) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET not set. Using development fallback. ' +
      'Set JWT_SECRET in .env for consistent tokens across restarts.'
    );
    return 'dev-secret-change-in-production-min-32-chars';
  }

  // Check if using weak default in development
  const weakSecrets = [
    'your-super-secret-jwt-key-change-in-production',
    'change-this-secret',
    'your-secret-key'
  ];
  if (weakSecrets.includes(secret)) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET is using a default/example value. ' +
      'This is OK for development but MUST be changed for production!'
    );
  }

  return secret;
}

/**
 * Get JWT sign options
 * @returns {Object} JWT sign options
 */
function getJwtSignOptions() {
  return {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    algorithm: 'HS256'
  };
}

/**
 * Get JWT verify options
 * @returns {Object} JWT verify options
 */
function getJwtVerifyOptions() {
  return {
    algorithms: ['HS256']
  };
}

/**
 * Validate JWT configuration on startup
 * Call this during app initialization to fail fast
 */
function validateJwtConfig() {
  const secret = getJwtSecret();
  console.log(`✅ JWT Config validated (${NODE_ENV} mode)`);
  console.log(`   Secret length: ${secret.length} characters`);
  return { secret, signOptions: getJwtSignOptions(), verifyOptions: getJwtVerifyOptions() };
}

module.exports = {
  getJwtSecret,
  getJwtSignOptions,
  getJwtVerifyOptions,
  validateJwtConfig
};