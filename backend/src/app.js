require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const http = require("http");
const { initSocket } = require("./socket");
const pool = require("./config/db");
const { globalApiLimiter } = require("./middleware/rateLimiter");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

// routes
const authRoutes = require("./modules/auth/auth.routes");
const taskRoutes = require("./modules/tasks/tasks.routes");
const userRoutes = require("./modules/users/users.routes");

/** @type {import('express').Express} */
const app = express();

// Security headers with Helmet
app.use(helmet({
  // CORS will be handled separately, but keep other protections
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP for development flexibility
}));

// CORS configuration - configurable via environment variable
/** @type {string[]} */
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(o => o.trim())
  : [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://workflow-manager-theta.vercel.app'
  ];

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  credentials: true
}));

// CSRF protection - disabled for API routes using Bearer tokens
// Only enable if using cookie-based authentication
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

app.use(express.json());

// Global API rate limiter
app.use('/api', globalApiLimiter);

// Health check
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
app.get("/api/v1/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

// CSRF token endpoint (for future cookie-based auth)
// app.get('/api/v1/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// Auth routes
app.use("/api/v1/auth", authRoutes);
// Task routes
app.use("/api/v1/tasks", taskRoutes);
// User routes
app.use("/api/v1/users", userRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server with Socket.IO
const PORT = process.env.PORT || 5000;
/** @type {import('http').Server} */
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});