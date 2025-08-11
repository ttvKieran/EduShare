const {body, param, query} = require('express-validator');

module.exports.updateCourse = [
  // body('name')
  //   .optional()
  //   .isString().withMessage('name must be a string'),
  // body('code')
  //   .optional()
  //   .isString().withMessage('code must be a string'),
  // body('description')
  //   .optional()
  //   .isString().withMessage('description must be a string'),
  // body('credits')
  //   .optional()
  //   .isInt({ min: 1 }).withMessage('credits must be a positive integer'),
  // body('facultyId')
  //   .optional()
  //   .isMongoId().withMessage('facultyId must be a valid MongoDB ID'),
  // body('departmentId')
  //   .optional()
  //   .isMongoId().withMessage('departmentId must be a valid MongoDB ID'),
  // body('prerequisites')
  //   .optional()
  //   .isArray().withMessage('prerequisites must be an array')
  //   .custom((ids) => ids.every(id => /^[a-f\d]{24}$/i.test(id)))
  //   .withMessage('Each prerequisite ID must be a valid MongoDB ID'),
];

module.exports.createCourse = [
  // body('name').notEmpty().withMessage('Course name is required'),
  // body('code').notEmpty().withMessage('Course code is required'),
  // body('description').optional().isString().withMessage('Description must be a string'),
  // body('credits').isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
  // body('facultyId').isMongoId().withMessage('facultyId must be a valid MongoDB ID'),
  // body('departmentId').isMongoId().withMessage('departmentId must be a valid MongoDB ID'),
];

module.exports.deleteCourse = [
  // param('courseId')
  //   .isMongoId().withMessage('courseId must be a valid MongoDB ID'),
];

module.exports.getCourseById = [
  // param('courseId')
  //   .isMongoId().withMessage('courseId must be a valid MongoDB ID'),
];  

module.exports.getCourses = [
  // query('keyword').optional().isString().withMessage('Keyword must be a string'),
  // query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  // query('skip').optional().isInt({ min: 0 }).withMessage('Skip must be a non-negative integer'),
];  