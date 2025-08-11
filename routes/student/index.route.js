const express = require('express');
const classRoute = require('./class.route');
const documentRoute = require('./document.route');
const feedbackRoute = require('./feedback.route');
const notificationRoute = require('./notification.route');
const courseRoute = require('./course.route');
const { prefixStudent } = require('../../configs/system');
const permission = require('../../middlewares/permission.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');

module.exports = (app) => {
    app.use(authMiddleware.isAuth);
    app.use(prefixStudent + '/classes', classRoute);
    app.use(prefixStudent + '/documents', documentRoute);
    app.use(prefixStudent + '/feedbacks', feedbackRoute);
    app.use(prefixStudent + '/notifications', notificationRoute);
    app.use(prefixStudent + '/courses', courseRoute);
}
