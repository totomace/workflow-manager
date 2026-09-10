const { z } = require('zod');

/**
 * Auth validation schemas
 */

// Register validation
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
    full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name too long'),
  }),
});

// Login validation
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Google login validation
const googleLoginSchema = z.object({
  body: z.object({
    credential: z.string().min(1, 'Google credential is required'),
  }),
});

// Refresh token validation
const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

// Set password validation (for Google users)
const setPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
  }),
});

// Logout validation (no body needed, but keep consistent)
const logoutSchema = z.object({
  body: z.object({}).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  refreshSchema,
  setPasswordSchema,
  logoutSchema,
};