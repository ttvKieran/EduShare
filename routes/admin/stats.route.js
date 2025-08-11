const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/admin/stats.controller");
const permission = require('../../middlewares/permission.middleware');

router.use(permission.checkPermission(['admin']));
router.get("/overview", statsController.getOverviewStats);
router.get("/faculties", statsController.getStatsByFaculty);
router.get("/departments", statsController.getStatsByDepartment);
router.get("/courses/:courseId/classes", statsController.getClassesByCourse);
router.get("/classes/:classId/students", statsController.getStudentsByClass);

module.exports = router;