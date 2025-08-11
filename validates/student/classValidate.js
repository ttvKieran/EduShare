const { body, param , query} = require('express-validator');
const mongoose = require('mongoose');

module.exports.getAllClasses = [
    // query('keyword')
    //     .optional()
    //     .trim()
    //     .isLength({ max: 100 }).withMessage('Từ khóa không được vượt quá 100 ký tự'),
    // query('limit')
    //     .optional()
    //     .isInt({ min: 1, max: 100 }).withMessage('Giới hạn phải là số nguyên từ 1 đến 100'),
    // query('skip')
    //     .optional()
    //     .isInt({ min: 0 }).withMessage('Bỏ qua phải là số nguyên không âm'),
];

module.exports.getClassById = [
    // param('classId')
    //     .notEmpty().withMessage('Class ID là bắt buộc')
    //     .isMongoId().withMessage('Class ID không hợp lệ'),
];