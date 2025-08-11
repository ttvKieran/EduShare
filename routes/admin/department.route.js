const express = require("express");
const router = express.Router();
const departmentController = require("../../controllers/admin/department.controller");
const departmentValidate = require("../../validates/admin/departmentValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");

const permission = require('../../middlewares/permission.middleware');

// router.use(permission.checkPermission(['admin']));

// POST /api/admin/departments/create
router.post("/create", departmentController.createDepartment);

// DELETE /api/admin/departments/:id
router.delete("/delete/:id", departmentValidate.deleteDepartment, handleValidation, departmentController.deleteDepartment);

// PATCH /api/admin/departments/:id
router.patch("/update/:id", departmentValidate.updateDepartment, handleValidation, departmentController.updateDepartment);

// GET /api/admin/departments
router.get("/", departmentValidate.getDepartments, handleValidation, departmentController.getDepartments);

// GET /api/admin/departments/:id
router.get("/:id", departmentValidate.getDepartmentById, handleValidation, departmentController.getDepartmentById);

module.exports = router;