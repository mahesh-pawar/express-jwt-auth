const createRateLimit = require('../utils/createRateLimiter');

const authRateLimiter = {
    registerLimiter: createRateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10,
        message: 'Too many accounts created from this IP. Please try again later.'
    }),

    loginLimiter: createRateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5,
        message: 'Too many accounts created from this IP. Please try again later.'
    })
}

module.exports = authRateLimiter;