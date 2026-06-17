const router = require('express').Router();
const authMiddleware = require('../../middleware/auth.middleware');
const controller = require('./users.controller');

router.use(authMiddleware);
router.get('/me', controller.getProfile);
router.put('/me', controller.updateProfile);
router.put('/me/password', controller.changePassword);

module.exports = router;