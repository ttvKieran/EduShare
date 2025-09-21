const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/lecturer/notification.controller");
const courseValidate = require("../../validates/lecturer/courseValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");
const permission = require('../../middlewares/permission.middleware');
// router.use(permission.checkPermission(['admin', 'lecturer']));

// GET: /lecturer/notifications/
router.get("/", notificationController.getNotificationOfLecturer);

// POST: /lecturer/notifications/create
router.post("/create", notificationController.createNotification);

// GET: /lecturer/notifications/class/:classId
router.get("/class/:classId", notificationController.getNotificationOfClass);

// GET: /lecturer/notifications/course/:courseId
router.get("/course/:courseId", notificationController.getNotificationOfCourse);

// DELETE: /lecturer/notifications/:id
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;