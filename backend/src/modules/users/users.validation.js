const { z } = require('zod');

/**
 * Users validation schemas
 */

// Update profile validation
const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(2, 'Họ tên ít nhất 2 ký tự').max(100, 'Họ tên quá dài'),
  }),
});

// Change password validation
const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
    newPassword: z.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự').max(128, 'Mật khẩu quá dài'),
  }),
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
};