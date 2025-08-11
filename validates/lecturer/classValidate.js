const { body, query, param } = require('express-validator');

module.exports.updateClass = [
  // param('classId')
  //   .isMongoId().withMessage('classId must be a valid MongoDB ID'),
  // body('instructor')
  //   .optional()
  //   .isMongoId().withMessage('instructor must be a valid MongoDB ID'),
  // body('students')
  //   .optional()
  //   .isArray().withMessage('students must be an array')
  //   .custom((students) => {
  //     return students.every(id => /^[a-f\d]{24}$/i.test(id));
  //   }).withMessage('Each student ID must be a valid MongoDB ID'),
  // body('academicYear')
  //   .notEmpty().withMessage('academicYear is required')
  //   .matches(/^\d{4}-\d{4}$/).withMessage('academicYear must be in the format YYYY-YYYY'),
  // body('semester')
  //   .notEmpty().withMessage('semester is required')
  //   .isIn(['Spring', 'Summer', 'Fall', 'Winter'])
  //   .withMessage('semester must be one of Spring, Summer, Fall, Winter'),
  // body('schedule')
  //   .isArray({ min: 1 }).withMessage('schedule must be a non-empty array'),
  // body('schedule.*.dayOfWeek')
  //   .isInt({ min: 0, max: 6 }).withMessage('dayOfWeek must be an integer from 0 (Sunday) to 6 (Saturday)'),
  // body('schedule.*.startTime')
  //   .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('startTime must be in HH:mm format'),
  // body('schedule.*.endTime')
  //   .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('endTime must be in HH:mm format'),
  // body('schedule.*.location')
  //   .notEmpty().withMessage('location is required'),
  // body('status')
  //   .notEmpty().withMessage('status is required')
  //   .isIn(['active', 'inactive', 'completed'])
  //   .withMessage('status must be either active, inactive, or completed')
];

module.exports.getClass = [
    // param('id').notEmpty().isMongoId().withMessage('classId must be a valid MongoDB ID'),
]

module.exports.getAllClasses = [
  // query('keyword').optional()
  //   .isString().withMessage('keyword must be a string'),
  // query('limit').optional()
  //   .isInt({ min: 1 }).withMessage('limit must be a positive integer'),
  // query('skip').optional()
  //   .isInt({ min: 0 }).withMessage('skip must be a non-negative integer'),
];