const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/student/notification.controller");
const classValidate = require("../../validates/student/classValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");
const permission = require('../../middlewares/permission.middleware');
// router.use(permission.checkPermission(['admin', 'lecturer', 'student']));

// GET: /student/notifications/
router.get("/", notificationController.getNotification);

// GET: /student/notifications/:courseId
router.get("/:courseId", notificationController.getNotificationByCourse);

module.exports = router;