const { body, query, param } = require('express-validator');

module.exports.createDocument = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type')
    .isIn(['textbook', 'lecture', 'exercise', 'exam', 'reference'])
    .withMessage('Invalid type'),
  body('courseId').optional().isMongoId().withMessage('Invalid courseId'),
];

module.exports.getDocument = [
  query('type').optional().isIn(['textbook', 'lecture', 'exercise', 'exam', 'reference']),
  query('courseId').optional().isMongoId(),
  query('facultyId').optional().isMongoId(),
];

module.exports.getDocumentDetail = [
  param('id').isMongoId(),
]

