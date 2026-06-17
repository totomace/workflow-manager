const tasksService = require('./tasks.service');
const { getIO } = require('../../socket');

exports.create = async (req, res) => {
  try {
    const { title, description, status, amount } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const task = await tasksService.create({ title, description, status, amount }, req.user.id);
    getIO().emit('task:created', task);
    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const tasks = await tasksService.getAllByUser(req.user.id);
    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const task = await tasksService.getById(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, status, amount } = req.body;
    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const task = await tasksService.update(req.params.id, req.user.id, { title, description, status, amount });
    if (!task) return res.status(404).json({ error: 'Task not found or forbidden' });
    getIO().emit('task:updated', task);
    res.json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const task = await tasksService.delete(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found or forbidden' });
    getIO().emit('task:deleted', { id: req.params.id });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMoneyStats = async (req, res) => {
  try {
    const { period } = req.query;
    const total = await tasksService.getMoneyStats(req.user.id, period);
    res.json({ success: true, total, period: period || 'all' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStatusStats = async (req, res) => {
  try {
    const { period } = req.query;
    const counts = await tasksService.getStatusStats(req.user.id, period);
    res.json({ success: true, counts, period: period || 'all' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};