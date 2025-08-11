const express = require("express");
const router = express.Router();
const classController = require("../../controllers/lecturer/class.controller");
const classValidate = require("../../validates/lecturer/classValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");
const permission = require('../../middlewares/permission.middleware');
router.use(permission.checkPermission(['admin', 'lecturer']));
// GET: /lecturer/classes
router.get("/", classValidate.getAllClasses, handleValidation, classController.getAllClasses);

// GET: /lecturer/classes/:id
router.get("/:id", classValidate.getClass, handleValidation, classController.getClassById);

// GET: /lecturer/classes/students/:id
router.get("/students/:id", classValidate.getClass, handleValidation, classController.getStudentsInClass);

// DELETE: /lecturer/classes/students/delete/:id
router.delete("/students/delete/:id", classValidate.getClass, handleValidation, classController.deleteStudentInClass);

// PATCH: /lecturer/classes/update/:id
router.patch("/update/:id", classController.updateClass, handleValidation, classController.updateClass);

module.exports = router;