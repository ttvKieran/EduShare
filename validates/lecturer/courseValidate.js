const {body, param, query} = require('express-validator');

module.exports.getCourseById = [
  // param('id')
  //   .isMongoId().withMessage('courseId must be a valid MongoDB ID'),
];  

module.exports.getAllCourses = [
  // query('keyword').optional().isString().withMessage('Keyword must be a string'),
  // query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  // query('skip').optional().isInt({ min: 0 }).withMessage('Skip must be a non-negative integer'),
];  