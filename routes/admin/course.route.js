const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/admin/course.controller");
const courseValidate = require("../../validates/admin/courseValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");

const permission = require('../../middlewares/permission.middleware');

// router.use(permission.checkPermission(['admin']));

// POST: /admin/courses/create
router.post("/create", courseController.createCourse);

// DELETE: /admin/courses/delete/:id
router.delete("/delete/:id", courseValidate.deleteCourse,  handleValidation, courseController.deleteCourse);

// PATCH: /admin/courses/update/:id
router.patch("/update/:id", courseValidate.updateCourse, handleValidation, courseController.updateCourse);

// GET: /admin/courses
router.get("/", courseValidate.getCourses, handleValidation, courseController.getCourses);

// GET: /admin/courses/:id
router.get("/:id", courseValidate.getCourseById, handleValidation, courseController.getCourseById);

module.exports = router;