const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

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
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Object} ChangePasswordResult
 * @property {boolean} success
 * @property {string} [error]
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

class UsersService {
  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<UserRecord|null>} User record or null
   */
  async getById(id) {
    const result = await pool.query(
      'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update user profile
   * @param {number} id - User ID
   * @param {Object} data - Profile data
   * @param {string} data.full_name - User full name
   * @returns {Promise<UserRecord>} Updated user record
   */
  async updateProfile(id, { full_name }) {
    // Sanitize and validate input
    const sanitizedName = truncateInput(sanitizeInput(full_name), 100);

    if (!sanitizedName || sanitizedName.trim().length < 2) {
      throw new Error('Họ tên ít nhất 2 ký tự');
    }

    const result = await pool.query(
      'UPDATE users SET full_name = $1 WHERE id = $2 RETURNING id, email, full_name, created_at',
      [sanitizedName, id]
    );
    return result.rows[0];
  }

  /**
   * Change user password
   * @param {number} id - User ID
   * @param {Object} data - Password data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<ChangePasswordResult>} Result object
   */
  async changePassword(id, { currentPassword, newPassword }) {
    // Lấy user hiện tại
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!user.rows[0]) return { error: 'User not found' };

    // If user has no password (Google user), allow setting initial password
    // currentPassword should be empty or a special marker
    if (!user.rows[0].password_hash) {
      if (currentPassword && currentPassword !== 'GOOGLE_USER_SET_PASSWORD') {
        return { error: 'Tài khoản Google chưa có mật khẩu. Hãy dùng chức năng "Đặt mật khẩu" từ trang Profile.' };
      }
      // Hash mật khẩu mới và cập nhật
      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password_hash = $1, auth_provider = $2 WHERE id = $3', [hashed, 'both', id]);
      return { success: true };
    }

    // Kiểm tra mật khẩu cũ có đúng không (for users with existing password)
    const valid = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
    if (!valid) return { error: 'Mật khẩu hiện tại không đúng' };

    // Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
    const sameAsOld = await bcrypt.compare(newPassword, user.rows[0].password_hash);
    if (sameAsOld) return { error: 'Mật khẩu mới không được trùng với mật khẩu cũ' };

    // Hash mật khẩu mới và cập nhật
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, id]);
    return { success: true };
  }
}

module.exports = new UsersService();