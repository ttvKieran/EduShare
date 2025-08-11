const { query, param } = require('express-validator');
const mongoose = require('mongoose');

module.exports.getAllDocuments = [
    // query('type')
    //     .optional()
    //     .isIn(['lecture', 'exercise', 'reference', 'other'])
    //     .withMessage('Loại tài liệu không hợp lệ'),
    
    // query('search')
    //     .optional()
    //     .trim()
    //     .isLength({ max: 100 })
    //     .withMessage('Từ khóa tìm kiếm không được vượt quá 100 ký tự')
];

module.exports.getDocumentsByClass = [
    // param('classId')
    //     .notEmpty().withMessage('Class ID là bắt buộc')
    //     .isMongoId()
    //     .withMessage('Class ID không hợp lệ')
];

module.exports.getDocumentById = [
    // param('id')
    //     .notEmpty().withMessage('Document ID là bắt buộc')
    //     .isMongoId()
    //     .withMessage('Document ID không hợp lệ')
];

module.exports.download = [
    // param('id')
    //     .notEmpty().withMessage('Document ID là bắt buộc')
    //     .isMongoId()
    //     .withMessage('Document ID không hợp lệ')
];

module.exports.previewDocument = [
    // param('id')
    //     .notEmpty().withMessage('Document ID là bắt buộc')
    //     .isMongoId()
    //     .withMessage('Document ID không hợp lệ')
];