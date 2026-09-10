const router = require('express').Router();
const authMiddleware = require('../../middleware/auth.middleware');
const controller = require('./tasks.controller');
const { validate } = require('../../middleware/validation.middleware');
const { createTaskSchema, updateTaskSchema, getTaskSchema, deleteTaskSchema, getAllTasksSchema, moneyStatsSchema, statusStatsSchema } = require('./tasks.validation');

router.use(authMiddleware);
router.post('/', validate(createTaskSchema), controller.create);
router.get('/', validate(getAllTasksSchema), controller.getAll);
router.get('/stats/money', validate(moneyStatsSchema), controller.getMoneyStats);
router.get('/stats/status', validate(statusStatsSchema), controller.getStatusStats);
router.get('/:id', validate(getTaskSchema), controller.getById);
router.put('/:id', validate(updateTaskSchema), controller.update);
router.delete('/:id', validate(deleteTaskSchema), controller.delete);

module.exports = router;