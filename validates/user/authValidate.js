const { body, query, param } = require('express-validator');

module.exports.login = [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
    .isLength({min: 3}).withMessage('Password must at least 3 characters'),
]