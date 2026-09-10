const tasksService = require('./tasks.service');
const { getIO } = require('../../socket');
const { asyncHandler, ValidationError, NotFoundError } = require('../../middleware/errorHandler');

/**
 * @typedef {Object} TaskData
 * @property {string} title - Task title
 * @property {string} [description] - Task description
 * @property {string} [status] - Task status (todo, in_progress, done)
 * @property {number} [amount] - Task amount
 * @property {string} [task_date] - Task date (ISO string)
 * @property {string} [start_time] - Start time (ISO string)
 * @property {string} [end_time] - End time (ISO string)
 */

/**
 * Create a new task
 * @param {import('express').Request} req - Express request with user and body
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.create = asyncHandler(async (req, res) => {
  /** @type {TaskData} */
  const { title, description, status, amount, task_date, start_time, end_time } = req.body;
  if (!title) throw new ValidationError('Title is required');
  const task = await tasksService.create(
    { title, description, status, amount, task_date, start_time, end_time },
    req.user.id
  );
  getIO().to(req.user.id.toString()).emit('task:created', task);
  res.status(201).json({ success: true, task });
});

/**
 * Get all tasks for the authenticated user
 * @param {import('express').Request} req - Express request with user
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.getAll = asyncHandler(async (req, res) => {
  const tasks = await tasksService.getAllByUser(req.user.id);
  res.json({ success: true, count: tasks.length, tasks });
});

/**
 * Get a specific task by ID
 * @param {import('express').Request} req - Express request with user and params.id
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.getById = asyncHandler(async (req, res) => {
  const task = await tasksService.getById(req.params.id, req.user.id);
  if (!task) throw new NotFoundError('Task not found');
  res.json({ success: true, task });
});

/**
 * Update a task
 * @param {import('express').Request} req - Express request with user, params.id, and body
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.update = asyncHandler(async (req, res) => {
  /** @type {TaskData} */
  const { title, description, status, amount, task_date, start_time, end_time } = req.body;
  const task = await tasksService.update(req.params.id, req.user.id, {
    title, description, status, amount, task_date, start_time, end_time
  });
  if (!task) throw new NotFoundError('Task not found or forbidden');
  getIO().to(req.user.id.toString()).emit('task:updated', task);
  res.json({ success: true, task });
});

/**
 * Delete a task
 * @param {import('express').Request} req - Express request with user and params.id
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.delete = asyncHandler(async (req, res) => {
  const task = await tasksService.delete(req.params.id, req.user.id);
  if (!task) throw new NotFoundError('Task not found or forbidden');
  getIO().to(req.user.id.toString()).emit('task:deleted', { id: req.params.id });
  res.json({ success: true, message: 'Task deleted' });
});

/**
 * Get money stats for the authenticated user
 * @param {import('express').Request} req - Express request with user and query.period
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.getMoneyStats = asyncHandler(async (req, res) => {
  /** @type {string|undefined} */
  const { period } = req.query;
  const total = await tasksService.getMoneyStats(req.user.id, period);
  res.json({ success: true, total, period: period || 'all' });
});

/**
 * Get status stats for the authenticated user
 * @param {import('express').Request} req - Express request with user and query.period
 * @param {import('express').Response} res - Express response
 * @returns {Promise<void>}
 */
exports.getStatusStats = asyncHandler(async (req, res) => {
  /** @type {string|undefined} */
  const { period } = req.query;
  const counts = await tasksService.getStatusStats(req.user.id, period);
  res.json({ success: true, counts, period: period || 'all' });
});