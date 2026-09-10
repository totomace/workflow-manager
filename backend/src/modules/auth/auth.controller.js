const authService = require("./auth.service");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { asyncHandler, ValidationError, AuthenticationError, ConflictError } = require("../../middleware/errorHandler");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate tokens (shared with service)
const generateTokens = (userData) => {
  const accessToken = jwt.sign(
    { id: userData.id, email: userData.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
  return { accessToken, refreshToken, refreshTokenExpiry };
};

const register = asyncHandler(async (req, res) => {
  const { email, password, full_name } = req.body;
  const result = await authService.register(email, password, full_name);
  // Login to get tokens
  const loginResult = await authService.login(email, password);
  res.json({ success: true, ...loginResult });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ValidationError("Refresh token is required");
  }
  const result = await authService.refreshAccessToken(refreshToken);
  res.json(result);
});

const logout = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (userId) {
    await authService.revokeRefreshToken(userId);
  }
  res.json({ success: true, message: "Logged out successfully" });
});

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    throw new ValidationError("Thiếu token Google");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, name } = payload;

  let user = await authService.findByEmail(email);
  if (!user) {
    user = await authService.createGoogleUser(email, name || "Google User");
  } else if (user.auth_provider === 'local') {
    // User registered with email/password first, allow Google login and update provider
    const pool = require("../../config/db");
    await pool.query(
      `UPDATE users SET auth_provider = 'both' WHERE id = $1`,
      [user.id]
    );
    user.auth_provider = 'both';
  }
  // If user.auth_provider === 'google' or 'both', proceed normally

  // Generate tokens using helper
  const { accessToken, refreshToken, refreshTokenExpiry } = generateTokens(user);

  // Store refresh token in database
  const pool = require("../../config/db");
  await pool.query(
    `UPDATE users SET refresh_token = $1, refresh_token_expiry = $2 WHERE id = $3`,
    [refreshToken, refreshTokenExpiry, user.id]
  );

  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, full_name: user.full_name } });
});

// Set password for Google users
const setPassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password || password.length < 6) {
    throw new ValidationError('Mật khẩu phải có ít nhất 6 ký tự');
  }

  const result = await authService.setPassword(userId, password);
  res.json({ success: true, ...result });
});

module.exports = { register, login, googleLogin, refresh, logout, setPassword };