import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Họ tên ít nhất 2 ký tự').max(100),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự'),
});

export const setPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu ít nhất 6 ký tự'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});