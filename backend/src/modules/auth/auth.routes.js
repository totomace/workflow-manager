const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const { authStrictLimiter, authRefreshLimiter, authGeneralLimiter } = require("../../middleware/rateLimiter");
const { validate } = require("../../middleware/validation.middleware");
const { registerSchema, loginSchema, googleLoginSchema, refreshSchema, setPasswordSchema, logoutSchema } = require("./auth.validation");

// Apply strict rate limiting to sensitive auth endpoints
router.post("/register", authStrictLimiter, validate(registerSchema), controller.register);
router.post("/login", authStrictLimiter, validate(loginSchema), controller.login);
router.post("/google", authStrictLimiter, validate(googleLoginSchema), controller.googleLogin);
router.post("/set-password", authMiddleware, authStrictLimiter, validate(setPasswordSchema), controller.setPassword);

// Apply moderate rate limiting to refresh endpoint
router.post("/refresh", authRefreshLimiter, validate(refreshSchema), controller.refresh);

// Apply general rate limiting to logout
router.post("/logout", authMiddleware, authGeneralLimiter, validate(logoutSchema), controller.logout);

module.exports = router;