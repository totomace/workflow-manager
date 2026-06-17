const router = require('express').Router();
const authMiddleware = require('../../middleware/auth.middleware');
const controller = require('./tasks.controller');

router.use(authMiddleware);
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/stats/money', controller.getMoneyStats);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;