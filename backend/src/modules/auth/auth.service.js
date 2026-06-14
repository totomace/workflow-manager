const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (email, password, full_name) => {
  const userExists = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userExists.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, full_name`,
    [email, hashedPassword, full_name]
  );

  return result.rows[0];
};

const login = async (email, password) => {
  const user = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (user.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(
    password,
    user.rows[0].password_hash
  );

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.rows[0].id,
      email: user.rows[0].email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.rows[0].id,
      email: user.rows[0].email,
      full_name: user.rows[0].full_name,
    },
  };
};

module.exports = {
  register,
  login,
};