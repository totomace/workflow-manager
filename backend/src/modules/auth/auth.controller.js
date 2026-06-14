const authService = require("./auth.service");

const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    const user = await authService.register(email, password, full_name);

    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
};