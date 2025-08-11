const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/user.controller");
const permission = require('../../middlewares/permission.middleware');

// router.use(permission.checkPermission(['admin']));

// GET: /admin/users/create
router.post("/create", userController.createUser);

// GET: /admin/users/lecturers
router.get("/lecturers", userController.getLecturers);

// GET: /admin/users/students
router.get("/students", userController.getStudents);

// POST: /admin/users/create
router.post("/students/create", userController.createStudent);

// POST: /admin/users/create
router.post("/lecturers/create", userController.createLecturer);

// PATCH: /admin/users/update/:userId
router.patch("/update/:userId", userController.updateUser);

module.exports = router;