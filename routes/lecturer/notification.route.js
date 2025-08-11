const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/lecturer/notification.controller");
const courseValidate = require("../../validates/lecturer/courseValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");
const permission = require('../../middlewares/permission.middleware');
// router.use(permission.checkPermission(['admin', 'lecturer']));

// POST: /lecturer/notifications
router.post("/create", notificationController.createNotification);

module.exports = router;