const pool = require('../../config/db');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

// Create DOMPurify instance for server-side sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * @typedef {Object} TaskRecord
 * @property {number} id
 * @property {string} title
 * @property {string} [description]
 * @property {string} status
 * @property {number} [amount]
 * @property {string} [task_date]
 * @property {string} [start_time]
 * @property {string} [end_time]
 * @property {number} user_id
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Object} TaskUpdateData
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [status]
 * @property {number} [amount]
 * @property {string} [task_date]
 * @property {string} [start_time]
 * @property {string} [end_time]
 */

/**
 * @typedef {Object} StatusCounts
 * @property {number} todo
 * @property {number} in_progress
 * @property {number} done
 */

/**
 * Sanitize HTML input to prevent XSS
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  // Use DOMPurify to strip all HTML tags and dangerous attributes
  // ALLOWED_TAGS: [] means strip all tags, ALLOWED_ATTR: [] means strip all attributes
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Truncate string to max length
 * @param {string} input - Input string
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
function truncateInput(input, maxLength) {
  if (typeof input !== 'string') return input;
  return input.length > maxLength ? input.slice(0, maxLength) : input;
}

// Valid task statuses
/** @type {string[]} */
const VALID_STATUSES = ['todo', 'in_progress', 'done'];

// Valid status transitions: from -> allowed to
/** @type {Object.<string, string[]>} */
const VALID_TRANSITIONS = {
  todo: ['in_progress', 'done'],
  in_progress: ['todo', 'done'],
  done: ['in_progress'], // Can reopen to in_progress, but not directly to todo
};

/**
 * Validate task status
 * @param {string} status - Status to validate
 * @returns {string} Validated status
 * @throws {Error} If status is invalid
 */
function validateStatus(status) {
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    const error = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    error.code = 'INVALID_STATUS';
    throw error;
  }
  return status || 'todo';
}

/**
 * Validate status transition
 * @param {string} currentStatus - Current task status
 * @param {string} newStatus - New status to transition to
 * @throws {Error} If transition is invalid
 */
function validateStatusTransition(currentStatus, newStatus) {
  if (currentStatus === newStatus) return; // No change, valid

  /** @type {string[]|undefined} */
  const allowedTransitions = VALID_TRANSITIONS[currentStatus];
  if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
    const error = new Error(
      `Invalid status transition from '${currentStatus}' to '${newStatus}'. ` +
      `Allowed transitions from '${currentStatus}': ${(allowedTransitions || []).join(', ') || 'none'}`
    );
    error.code = 'INVALID_STATUS_TRANSITION';
    throw error;
  }
}

class TasksService {
  /**
   * Create a new task
   * @param {TaskUpdateData} taskData - Task data
   * @param {number} userId - User ID
   * @returns {Promise<TaskRecord>} Created task
   */
  async create({ title, description, status = 'todo', amount = 0, task_date, start_time, end_time }, userId) {
    // Sanitize and validate inputs
    const sanitizedTitle = truncateInput(sanitizeInput(title), 200);
    const sanitizedDescription = truncateInput(sanitizeInput(description), 500);
    const validatedStatus = validateStatus(status);

    if (!sanitizedTitle || sanitizedTitle.trim().length === 0) {
      throw new Error('Title is required');
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, user_id, amount, task_date, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [sanitizedTitle, sanitizedDescription, validatedStatus, userId, amount, task_date, start_time, end_time]
    );
    return result.rows[0];
  }

  /**
   * Get all tasks for a user
   * @param {number} userId - User ID
   * @returns {Promise<TaskRecord[]>} List of tasks
   */
  async getAllByUser(userId) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  /**
   * Get a task by ID
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID
   * @returns {Promise<TaskRecord|null>} Task or null
   */
  async getById(taskId, userId) {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );
    return result.rows[0] || null;
  }

  /**
   * Update a task
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID
   * @param {TaskUpdateData} updates - Fields to update
   * @returns {Promise<TaskRecord|null>} Updated task or null
   */
  async update(taskId, userId, updates) {
    const task = await this.getById(taskId, userId);
    if (!task) return null;
    const { title, description, status, amount, task_date, start_time, end_time } = updates;

    // Sanitize and validate inputs if provided
    const sanitizedTitle = title !== undefined ? truncateInput(sanitizeInput(title), 200) : task.title;
    const sanitizedDescription = description !== undefined ? truncateInput(sanitizeInput(description), 500) : task.description;
    const validatedStatus = validateStatus(status);

    // Validate status transition if status is being changed
    if (status !== undefined) {
      validateStatusTransition(task.status, validatedStatus);
    }

    if (sanitizedTitle !== undefined && (!sanitizedTitle || sanitizedTitle.trim().length === 0)) {
      throw new Error('Title is required');
    }

    const result = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3, amount = $4,
       task_date = $5, start_time = $6, end_time = $7
       WHERE id = $8 AND user_id = $9 RETURNING *`,
      [
        sanitizedTitle,
        sanitizedDescription,
        validatedStatus || task.status,
        amount !== undefined ? amount : task.amount,
        task_date !== undefined ? task_date : task.task_date,
        start_time !== undefined ? start_time : task.start_time,
        end_time !== undefined ? end_time : task.end_time,
        taskId,
        userId
      ]
    );
    return result.rows[0];
  }

  /**
   * Delete a task
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID
   * @returns {Promise<TaskRecord|null>} Deleted task or null
   */
  async delete(taskId, userId) {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );
    return result.rows[0] || null;
  }

  /**
   * Get money stats for a user
   * @param {number} userId - User ID
   * @param {string} [period] - Time period (week, month, year, all)
   * @returns {Promise<number>} Total amount
   */
  async getMoneyStats(userId, period) {
    let dateFilter;
    const now = new Date();
    switch (period) {
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
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

    try {
      const result = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM tasks
         WHERE user_id = $1 AND status = 'done' AND created_at >= $2`,
        [userId, dateFilter]
      );
      return parseFloat(result.rows[0].total) || 0;
    } catch (err) {
      if (err.code === '42703') { // column "amount" does not exist in database table
        return 0;
      }
      throw err;
    }
  }

  /**
   * Get status stats for a user
   * @param {number} userId - User ID
   * @param {string} [period] - Time period (week, month, year, all)
   * @returns {Promise<StatusCounts>} Status counts
   */
  async getStatusStats(userId, period) {
    let dateFilter;
    const now = new Date();
    switch (period) {
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
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
      `SELECT status, COUNT(*) as count FROM tasks
       WHERE user_id = $1 AND created_at >= $2
       GROUP BY status`,
      [userId, dateFilter]
    );

    /** @type {StatusCounts} */
    const counts = { todo: 0, in_progress: 0, done: 0 };
    result.rows.forEach(row => {
      if (counts.hasOwnProperty(row.status)) {
        counts[row.status] = parseInt(row.count, 10);
      }
    });
    return counts;
  }
}

module.exports = new TasksService();