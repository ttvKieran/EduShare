const {body, param, query} = require('express-validator');

module.exports.createFaculty = [
  // body('name')
  //   .notEmpty().withMessage('Faculty name is required')
  //   .isString().withMessage('Faculty name must be a string'),
  // body('code')
  //   .notEmpty().withMessage('Faculty code is required')
  //   .isString().withMessage('Faculty code must be a string'),
  // body('description')
  //   .optional()
  //   .isString().withMessage('Description must be a string'),
  // // body('dean')
  // //   .notEmpty().withMessage('Dean ID is required')
  // //   .isMongoId().withMessage('Dean ID must be a valid MongoDB ID'),
  // body('establishedDate')
  //   .notEmpty().withMessage('Established date is required')
  //   .isISO8601().withMessage('Established date must be a valid ISO date'),
  // body('contactInfo').notEmpty().withMessage('Contact info is required'),
  // body('contactInfo.email')
  //   .notEmpty().withMessage('Email is required')
  //   .isEmail().withMessage('Invalid email format'),
  // body('contactInfo.phone')
  //   .notEmpty().withMessage('Phone number is required')
  //   .isString().withMessage('Phone must be a string'),
  // body('contactInfo.location')
  //   .notEmpty().withMessage('Location is required')
  //   .isString().withMessage('Location must be a string'),
];

module.exports.updateFaculty = [
  // param('facultyId')
  //   .isMongoId().withMessage('facultyId must be a valid MongoDB ID'),
  // body('name')
  //   .optional()
  //   .isString().withMessage('name must be a string'),
  // body('code')
  //   .optional()
  //   .isString().withMessage('code must be a string'),
  // body('description')
  //   .optional()
  //   .isString().withMessage('description must be a string'),
  // body('dean')
  //   .optional()
  //   .isMongoId().withMessage('dean must be a valid MongoDB ID'),
  // body('establishedDate')
  //   .optional()
  //   .isISO8601().withMessage('establishedDate must be a valid ISO date'),
  // body('contactInfo').optional().isObject().withMessage('contactInfo must be an object'),
  // body('contactInfo.email')
  //   .optional()
  //   .isEmail().withMessage('Invalid email format'),
  // body('contactInfo.phone')
  //   .optional()
  //   .isString().withMessage('phone must be a string'),
  // body('contactInfo.location')
  //   .optional()
  //   .isString().withMessage('location must be a string'),
];

module.exports.deleteFaculty = [
    // param('id').notEmpty().withMessage('ID khoa không được để trống')
    //     .isMongoId().withMessage('ID khoa không hợp lệ'),
];

module.exports.getFaculties = [
    // query('keyword').optional().isString().withMessage('Keyword must be a string'),
    // query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    // query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

module.exports.getFacultyById = [
    // param('id').notEmpty().withMessage('ID khoa không được để trống')
    //     .isMongoId().withMessage('ID khoa không hợp lệ'),
];