const { body, validationResult } = require('express-validator');

const ERROR_CODES = {
    required: 'FIELD_REQUIRED',
    email: 'INVALID_FORMAT',
    minLength: 'TOO_SHORT'
};

function handleValidationErrors(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }

    const errors = result.array().map(err => ({
        field: err.path,
        code: err.msg.code,
        message: err.msg.message
    }));

    res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'The request contains invalid or missing fields',
        errors
    });
}

const validateAuth = {
    registerRules: [
        body('name')
            .trim()
            .notEmpty().withMessage({ code: ERROR_CODES.required, message: 'Name is required' }),

        body('email')
            .trim()
            .notEmpty().withMessage({ code: ERROR_CODES.required, message: 'Email is required' })
            .bail()
            .isEmail().withMessage({ code: ERROR_CODES.email, message: 'Please provide a valid email address' })
            .normalizeEmail(),

        body('password')
            .notEmpty().withMessage({ code: ERROR_CODES.required, message: 'Password is required' })
            .bail()
            .isLength({ min: 8 }).withMessage({ code: ERROR_CODES.minLength, message: 'Password must be at least 8 characters long' }),

        handleValidationErrors
    ],

    loginRules: [
        body('email')
            .trim()
            .notEmpty().withMessage({ code: ERROR_CODES.required, message: 'Email is required' })
            .bail()
            .isEmail().withMessage({ code: ERROR_CODES.email, message: 'Please provide a valid email address' })
            .normalizeEmail(),

        body('password')
            .notEmpty().withMessage({ code: ERROR_CODES.required, message: 'Password is required' }),

        handleValidationErrors
    ]
};

module.exports = validateAuth;