const pool = require('../../config/db');

class TasksService {
  async create({ title, description, status = 'todo', amount = 0 }, userId) {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id, amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, status, userId, amount]
    );
    return result.rows[0];
  }

  async getAllByUser(userId) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async getById(taskId, userId) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );
    return result.rows[0] || null;
  }

  async update(taskId, userId, updates) {
    const task = await this.getById(taskId, userId);
    if (!task) return null;
    const { title, description, status, amount } = updates;
    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3, amount = $4
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [
        title || task.title,
        description !== undefined ? description : task.description,
        status || task.status,
        amount !== undefined ? amount : task.amount,
        taskId,
        userId
      ]
    );
    return result.rows[0];
  }

  async delete(taskId, userId) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );
    return result.rows[0] || null;
  }

  async getMoneyStats(userId, period) {
    let dateFilter;
    const now = new Date();
    switch (period) {
      case 'week':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        dateFilter = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        dateFilter = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        dateFilter = new Date(0);
    }

    const result = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM tasks 
       WHERE user_id = $1 AND status = 'done' AND created_at >= $2`,
      [userId, dateFilter]
    );
    return result.rows[0].total;
  }
}

module.exports = new TasksService();