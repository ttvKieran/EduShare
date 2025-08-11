const express = require("express");
const router = express.Router();
const classController = require("../../controllers/admin/class.controller");
const classValidate = require("../../validates/admin/classValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");

const permission = require('../../middlewares/permission.middleware');

// router.use(permission.checkPermission(['admin']));

// POST: /admin/classes/create
router.post("/create", classController.createClass);

// DELETE: /admin/classes/delete/:id
router.delete("/delete/:id", classValidate.getClass, handleValidation, classController.deleteClass);

// PATCH: /admin/classes/update/:id
router.patch("/update/:id", classValidate.updateClass, handleValidation, classController.updateClass);

// GET: /admin/classes
router.get("/", classValidate.getClasses, handleValidation, classController.getClasses);

// GET: /admin/classes/:id
router.get("/:id", classValidate.getClass, handleValidation, classController.getClassById);

module.exports = router;