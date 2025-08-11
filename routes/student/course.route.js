const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/student/course.controller");
const classValidate = require("../../validates/student/classValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");
const permission = require('../../middlewares/permission.middleware');
router.use(permission.checkPermission(['admin', 'lecturer', 'student']));

// GET: /student/courses/:courseId
router.get("/:courseId", courseController.getCourseDetail);

module.exports = router;