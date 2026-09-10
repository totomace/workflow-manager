const router = require('express').Router();
const authMiddleware = require('../../middleware/auth.middleware');
const controller = require('./users.controller');
const { validate } = require('../../middleware/validation.middleware');
const { updateProfileSchema, changePasswordSchema } = require('./users.validation');

router.use(authMiddleware);
router.get('/me', controller.getProfile);
router.put('/me', validate(updateProfileSchema), controller.updateProfile);
router.put('/me/password', validate(changePasswordSchema), controller.changePassword);

module.exports = router;