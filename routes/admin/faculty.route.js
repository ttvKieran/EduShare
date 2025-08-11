const express = require("express");
const router = express.Router();
const facultyController = require("../../controllers/admin/faculty.controller");
const facultyValidate = require("../../validates/admin/facultyValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");

const permission = require('../../middlewares/permission.middleware');

// router.use(permission.checkPermission(['admin']));

// POST: /admin/faculties/create
router.post("/create", facultyController.createFaculty);

// DELETE: /admin/faculties/delete/:id
router.delete("/delete/:id", facultyValidate.deleteFaculty, handleValidation, facultyController.deleteFaculty);

// PATCH: /admin/faculties/update/:id
router.patch("/update/:id", facultyValidate.updateFaculty, handleValidation, facultyController.updateFaculty);

// GET: /admin/faculties
router.get("/", facultyValidate.getFaculties, handleValidation, facultyController.getFaculties);

// GET: /admin/faculties/:id
router.get("/:id", facultyValidate.getFacultyById, handleValidation, facultyController.getFacultyById);

module.exports = router;