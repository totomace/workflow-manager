const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { getJwtSecret, getJwtSignOptions } = require('../../config/jwt');

// Create DOMPurify instance for server-side sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * @typedef {Object} UserRecord
 * @property {number} id
 * @property {string} email
 * @property {string} full_name
 * @property {string} [password_hash]
 * @property {string} auth_provider
 * @property {string} [refresh_token]
 * @property {Date} [refresh_token_expiry]
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Object} TokenPair
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {Date} [refreshTokenExpiry]
 * @property {UserRecord} [user]
 */

/**
 * Sanitize HTML input to prevent XSS
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Truncate string to max length
 * @param {string} input - Input string
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
function truncateInput(input, maxLength) {
  if (typeof input !== 'string') return input;
  return input.length > maxLength ? input.slice(0, maxLength) : input;
}

// Generate a secure random refresh token
/** @returns {string} */
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Calculate expiry date for refresh token (7 days)
/** @returns {Date} */
const getRefreshTokenExpiry = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return expiry;
};

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} full_name - User full name
 * @returns {Promise<UserRecord>} Created user record
 */
const register = async (email, password, full_name) => {
  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (userExists.rows.length > 0) throw new Error("Email already exists");

  // Sanitize and validate full_name
  const sanitizedName = truncateInput(sanitizeInput(full_name), 100);
  if (!sanitizedName || sanitizedName.trim().length < 2) {
    throw new Error('Họ tên ít nhất 2 ký tự');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, auth_provider) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name`,
    [email, hashedPassword, sanitizedName, 'local']
  );
  return result.rows[0];
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<TokenPair>} Access token, refresh token, and user info
 */
const login = async (email, password) => {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (user.rows.length === 0) throw new Error("Invalid credentials");

  const userData = user.rows[0];

  // Check if user has a password (not a Google-only account)
  if (!userData.password_hash) {
    throw new Error("Tài khoản này đăng nhập bằng Google. Vui lòng dùng nút 'Đăng nhập bằng Google'.");
  }

  const valid = await bcrypt.compare(password, userData.password_hash);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    { id: userData.id, email: userData.email },
    getJwtSecret(),
    getJwtSignOptions()
  );

  const refreshToken = generateRefreshToken();
  const refreshTokenExpiry = getRefreshTokenExpiry();

  // Store refresh token in database
  await pool.query(
    `UPDATE users SET refresh_token = $1, refresh_token_expiry = $2 WHERE id = $3`,
    [refreshToken, refreshTokenExpiry, userData.id]
  );

  return {
    accessToken,
    refreshToken,
    user: { id: userData.id, email: userData.email, full_name: userData.full_name }
  };
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<{accessToken: string, refreshToken: string}>} New token pair
 */
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token is required");

  const user = await pool.query(
    `SELECT * FROM users WHERE refresh_token = $1 AND refresh_token_expiry > NOW()`,
    [refreshToken]
  );

  if (user.rows.length === 0) throw new Error("Invalid or expired refresh token");

  const userData = user.rows[0];

  // Generate new access token
  const accessToken = jwt.sign(
    { id: userData.id, email: userData.email },
    getJwtSecret(),
    getJwtSignOptions()
  );

  // Optionally rotate refresh token (generate new one for security)
  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenExpiry = getRefreshTokenExpiry();

  await pool.query(
    `UPDATE users SET refresh_token = $1, refresh_token_expiry = $2 WHERE id = $3`,
    [newRefreshToken, newRefreshTokenExpiry, userData.id]
  );

  return { accessToken, refreshToken: newRefreshToken };
};

/**
 * Revoke refresh token for a user
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
const revokeRefreshToken = async (userId) => {
  await pool.query(
    `UPDATE users SET refresh_token = NULL, refresh_token_expiry = NULL WHERE id = $1`,
    [userId]
  );
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<UserRecord|null>} User record or null
 */
const findByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

/**
 * Create a Google user (no password)
 * @param {string} email - User email
 * @param {string} fullName - User full name
 * @returns {Promise<UserRecord>} Created user record
 */
const createGoogleUser = async (email, fullName) => {
  // Sanitize and validate fullName
  const sanitizedName = truncateInput(sanitizeInput(fullName), 100);
  if (!sanitizedName || sanitizedName.trim().length < 2) {
    throw new Error('Tên người dùng không hợp lệ');
  }

  const result = await pool.query(
    "INSERT INTO users (email, full_name, password_hash, auth_provider) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name",
    [email, sanitizedName, null, 'google']
  );
  return result.rows[0];
};

/**
 * Set password for Google users (who have password_hash = NULL)
 * @param {number} userId - User ID
 * @param {string} password - New password
 * @returns {Promise<TokenPair>} New token pair with user info
 */
const setPassword = async (userId, password) => {
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (!user.rows[0]) throw new Error('User not found');

  // Only allow setting password if user doesn't have one (Google user)
  if (user.rows[0].password_hash) {
    throw new Error('Tài khoản đã có mật khẩu. Hãy dùng chức năng đổi mật khẩu.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    `UPDATE users SET password_hash = $1, auth_provider = 'both' WHERE id = $2`,
    [hashedPassword, userId]
  );

  // Generate tokens after setting password
  const accessToken = jwt.sign(
    { id: user.rows[0].id, email: user.rows[0].email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const refreshToken = generateRefreshToken();
  const refreshTokenExpiry = getRefreshTokenExpiry();

  await pool.query(
    `UPDATE users SET refresh_token = $1, refresh_token_expiry = $2 WHERE id = $3`,
    [refreshToken, refreshTokenExpiry, userId]
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user.rows[0].id, email: user.rows[0].email, full_name: user.rows[0].full_name }
  };
};

module.exports = { register, login, findByEmail, createGoogleUser, refreshAccessToken, revokeRefreshToken, setPassword };