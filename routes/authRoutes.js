const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authValidator = require('../validators/authValidator');

router.post('/register', authValidator.registerRules, authController.register);
router.post('/login', authValidator.loginRules, authController.login);
router.get('/me', authMiddleware.requireAuth, authController.me);

module.exports = router;