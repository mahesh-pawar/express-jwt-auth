const rateLimit = require('express-rate-limit');

function createRateLimit({windowMs, max, message}) {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                status: 'error',
                code: 'TOO_MANY_REQUESTS',
                message
            });
        }
    });
}

module.exports = createRateLimit;