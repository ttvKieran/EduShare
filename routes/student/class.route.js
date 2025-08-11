const express = require("express");
const router = express.Router();
const classController = require("../../controllers/student/class.controller");
const classValidate = require("../../validates/student/classValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");
const permission = require('../../middlewares/permission.middleware');
router.use(permission.checkPermission(['admin', 'lecturer', 'student']));
// GET: /student/classes
router.get("/", classController.getAllClasses);

// GET: /student/classes/:classId
router.get("/:classId", classController.getClassById);

module.exports = router;