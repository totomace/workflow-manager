require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// routes
const authRoutes = require("./modules/auth/auth.routes");
const taskRoutes = require("./modules/tasks/tasks.routes");
const userRoutes = require("./modules/users/users.routes");

const app = express();

// Danh sách domain được phép truy cập
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://workflow-manager-theta.vercel.app' // 👈 thay bằng domain Vercel của bạn sau khi deploy
];

// middleware CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// health check
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

// auth routes
app.use("/api/v1/auth", authRoutes);
// task routes
app.use("/api/v1/tasks", taskRoutes);
// user routes
app.use("/api/v1/users", userRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});