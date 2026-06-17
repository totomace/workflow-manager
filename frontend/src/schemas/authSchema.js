import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  fullName: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});