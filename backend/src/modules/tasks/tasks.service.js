const pool = require('../../config/db');

class TasksService {
  async create({ title, description, status = 'todo' }, userId) {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, status, userId]
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
    const { title, description, status } = updates;
    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *`,
      [title || task.title, description !== undefined ? description : task.description, status || task.status, taskId, userId]
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
}

module.exports = new TasksService();