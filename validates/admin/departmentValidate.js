const {param, query, body} = require('express-validator');

module.exports.getDepartments = [
    // query('keyword').optional().isString().withMessage('Keyword must be a string'),
    // query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    // query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

module.exports.getDepartmentById = [
    // param('id').isMongoId().withMessage('Invalid department ID')
];  

module.exports.createDepartment = [
    // body('name').notEmpty().withMessage('Name is required'),
    // body('code').notEmpty().withMessage('Code is required'),
    // body('description').optional().isString().withMessage('Description must be a string'),
    // body('facultyId').notEmpty().isMongoId().withMessage('Faculty ID is required and must be a valid MongoDB ID'),
    // body('head').optional().isObject().withMessage('Head must be an object'),
    // body('staff').optional().isArray().withMessage('Staff must be an array'),
    // body('courses').optional().isArray().withMessage('Courses must be an array'),
    // body('contactInfo').optional().isObject().withMessage('Contact info must be an object')
];

module.exports.updateDepartment = [
    // param('id').isMongoId().withMessage('Invalid department ID'),
    // body('name').optional().notEmpty().withMessage('Name is required'),
    // body('code').optional().notEmpty().withMessage('Code is required'),
    // body('description').optional().isString().withMessage('Description must be a string'),
    // body('facultyId').optional().isMongoId().withMessage('Faculty ID must be a valid MongoDB ID'),
    // body('head').optional().isObject().withMessage('Head must be an object'),
    // body('staff').optional().isArray().withMessage('Staff must be an array'),
    // body('courses').optional().isArray().withMessage('Courses must be an array'),
    // body('contactInfo').optional().isObject().withMessage('Contact info must be an object')
];

module.exports.deleteDepartment = [
    // param('id').isMongoId().withMessage('Invalid department ID')
];