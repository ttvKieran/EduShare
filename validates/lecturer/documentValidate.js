const { query, body, param } = require('express-validator');

const getDocuments = [
//   query('type')
//     .optional()
//     .isString().withMessage('Type must be a string'),
//   query('courseId')
//     .optional()
//     .isMongoId().withMessage('Course ID must be a valid MongoDB ObjectId'),
//   query('facultyId')
//     .optional()
//     .isMongoId().withMessage('Faculty ID must be a valid MongoDB ObjectId'),
//   query('search')
//     .optional()
//     .isString().withMessage('Search query must be a string'),
//   query('limit')
//     .optional()
//     .isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
//   query('skip')
//     .optional()
//     .isInt({ min: 0 }).withMessage('Skip must be an integer greater than or equal to 0')
];

const getDocumentsByCourse = [
    // param('courseId')
    //     .notEmpty().withMessage('Course ID là bắt buộc')
    //     .isMongoId().withMessage('Course ID không hợp lệ'),
];

const getDocumentsByClass = [
    // param('classId')
    //     .notEmpty().withMessage('Class ID là bắt buộc')
    //     .isMongoId().withMessage('Class ID không hợp lệ'),
];

const getDocumentById = [
    // param('id')
    //     .notEmpty().withMessage('Document ID là bắt buộc')
    //     .isMongoId().withMessage('Document ID không hợp lệ'),
];

const updateDocument = [
    // param('id')
    //     .notEmpty().withMessage('Document ID là bắt buộc')
    //     .isMongoId().withMessage('Document ID không hợp lệ'),

    // body('title')
    //     .optional()
    //     .trim()
    //     .isLength({ min: 1, max: 255 }).withMessage('Tiêu đề phải từ 1-255 ký tự'),
    
    // body('description')
    //     .optional()
    //     .trim()
    //     .isLength({ max: 1000 }).withMessage('Mô tả không được vượt quá 1000 ký tự'),
    
    // body('accessControl.accessLevel')
    //     .optional()
    //     .isIn(['public', 'restricted', 'private']).withMessage('Mức truy cập không hợp lệ'),
    
    // body('accessControl.allowedRoles')
    //     .optional()
    //     .isArray().withMessage('Các vai trò được phép phải là một mảng'),
];

const uploadDocument = [
    // body('title')
    //     .notEmpty().withMessage('Tiêu đề là bắt buộc')
    //     .trim()
    //     .isLength({ min: 1, max: 255 }).withMessage('Tiêu đề phải từ 1-255 ký tự'),
    
    // body('description')
    //     .optional()
    //     .trim()
    //     .isLength({ max: 1000 }).withMessage('Mô tả không được vượt quá 1000 ký tự'),
    
    // body('courseId')
    //     .optional()
    //     .isMongoId().withMessage('Course ID không hợp lệ'),
    
    // body('classId')
    //     .optional()
    //     .isMongoId().withMessage('Class ID không hợp lệ'),
    
    // body('facultyId')
    //     .optional()
    //     .isMongoId().withMessage('Faculty ID không hợp lệ'),
    
    // body('departmentId')
    //     .optional()
    //     .isMongoId().withMessage('Department ID không hợp lệ'),

    
    // body('accessControl.accessLevel')
    //     .optional()
    //     .isIn(['public', 'restricted', 'private']).withMessage('Mức truy cập không hợp lệ')
    //     .default('restricted'),
    
    // body('accessControl.allowedRoles')
    //     .optional()
    //     .isArray().withMessage('Các vai trò được phép phải là một mảng')
    //     .default(['student', 'lecturer']),
];

const deleteDocument = [
    // param('id')
    //     .notEmpty().withMessage('Document ID là bắt buộc')
    //     .isMongoId().withMessage('Document ID không hợp lệ'),
];

const previewDocument = [
    // param('id')
    //     .notEmpty().withMessage('Document ID là bắt buộc')
    //     .isMongoId().withMessage('Document ID không hợp lệ'),
];

module.exports = {
    getDocuments,
    getDocumentsByCourse,
    getDocumentsByClass,
    getDocumentById,
    updateDocument,
    uploadDocument,
    deleteDocument,
    previewDocument
};