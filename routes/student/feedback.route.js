const express = require("express");
const router = express.Router();
const feedbackController = require("../../controllers/student/feedback.controller");
const classValidate = require("../../validates/student/classValidate");
const handleValidation = require("../../middlewares/handleValidate.middleware");
const permission = require('../../middlewares/permission.middleware');
// router.use(permission.checkPermission(['admin', 'lecturer', 'student']));

// GET: /student/feedbacks/replies/feedbackId
router.get("/replies/:feedbackId", feedbackController.getRelies);

// GET: /student/feedbacks
router.get("/:documentId", feedbackController.getAllFeedback);

// POST: /student/feedbacks/:documentId
router.post("/:documentId", feedbackController.createFeedback);

module.exports = router;