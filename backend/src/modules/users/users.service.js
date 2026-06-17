const pool = require('../../config/db');
const bcrypt = require('bcrypt');

class UsersService {
  async getById(id) {
    const result = await pool.query(
      'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async updateProfile(id, { full_name }) {
    const result = await pool.query(
      'UPDATE users SET full_name = $1 WHERE id = $2 RETURNING id, email, full_name, created_at',
      [full_name, id]
    );
    return result.rows[0];
  }

  async changePassword(id, { currentPassword, newPassword }) {
    // Lấy user hiện tại
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!user.rows[0]) return { error: 'User not found' };

    // Kiểm tra mật khẩu cũ có đúng không
    const valid = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
    if (!valid) return { error: 'Mật khẩu hiện tại không đúng' };

    // Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
    const sameAsOld = await bcrypt.compare(newPassword, user.rows[0].password_hash);
    if (sameAsOld) return { error: 'Mật khẩu mới không được trùng với mật khẩu cũ' };

    // Hash mật khẩu mới và cập nhật
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashed, id]);
    return { success: true };
  }
}

module.exports = new UsersService();