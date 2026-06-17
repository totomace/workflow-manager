const usersService = require('./users.service');

exports.getProfile = async (req, res) => {
  try {
    const user = await usersService.getById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name } = req.body;
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Họ tên ít nhất 2 ký tự' });
    }
    const user = await usersService.updateProfile(req.user.id, { full_name });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới ít nhất 6 ký tự' });
    }
    const result = await usersService.changePassword(req.user.id, { currentPassword, newPassword });
    if (result.error) return res.status(400).json({ error: result.error });
    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};