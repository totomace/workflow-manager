import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Họ tên ít nhất 2 ký tự').max(100),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự'),
});