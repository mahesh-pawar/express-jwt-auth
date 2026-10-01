const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authValidator = require('../validators/authValidator');
const authRateLimiter = require('../middlewares/authRateLimiter');

router.post('/register', authRateLimiter.registerLimiter, authValidator.registerRules, authController.register);
router.post('/login', authRateLimiter.loginLimiter, authValidator.loginRules, authController.login);
router.get('/me', authMiddleware.requireAuth, authController.me);

module.exports = router;