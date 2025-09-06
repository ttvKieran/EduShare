const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/lecturer/course.controller");
const courseValidate = require("../../validates/lecturer/courseValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");
const permission = require('../../middlewares/permission.middleware');
router.use(permission.checkPermission(['admin', 'lecturer']));

// GET: /lecturer/courses/
router.get("/", courseController.getCoursesByLecturerId);

// GET: /lecturer/courses/:courseId
router.get("/:courseId", courseController.getCourseById);

// // GET: /lecturer/courses
// router.get("/", courseValidate.getAllCourses,  handleValidation, courseController.getAllCourses);

// // GET: /lecturer/courses/classes/:id
// router.get("/classes/:id",  handleValidation, courseController.getAllClassesByCourse);

// // GET: /lecturer/courses/:id
// router.get("/:id", courseValidate.getCourseById,  handleValidation, courseController.getCourseById);

module.exports = router;