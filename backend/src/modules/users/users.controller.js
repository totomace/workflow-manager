const usersService = require('./users.service');
const { asyncHandler, ValidationError, NotFoundError } = require('../../middleware/errorHandler');

/**
 * @typedef {Object} ProfileData
 * @property {string} full_name - User full name
 */

/**
 * @typedef {Object} ChangePasswordData
 * @property {string} currentPassword - Current password
 * @property {string} newPassword - New password
 */

/**
 * Get user profile
 * @param {import('express').Request} req - Express request with user
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await usersService.getById(req.user.id);
  if (!user) throw new NotFoundError('User not found');
  res.json({ success: true, user });
});

/**
 * Update user profile
 * @param {import('express').Request} req - Express request with user and body
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  /** @type {ProfileData} */
  const { full_name } = req.body;
  if (!full_name || full_name.trim().length < 2) {
    throw new ValidationError('Họ tên ít nhất 2 ký tự');
  }
  const user = await usersService.updateProfile(req.user.id, { full_name });
  res.json({ success: true, user });
});

/**
 * Change user password
 * @param {import('express').Request} req - Express request with user and body
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.changePassword = asyncHandler(async (req, res) => {
  /** @type {ChangePasswordData} */
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    throw new ValidationError('Mật khẩu mới ít nhất 6 ký tự');
  }
  const result = await usersService.changePassword(req.user.id, { currentPassword, newPassword });
  if (result.error) throw new ValidationError(result.error);
  res.json({ success: true, message: 'Đổi mật khẩu thành công' });
});