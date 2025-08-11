const express = require('express');
const classRoute = require('./class.route');
const documentRoute = require('./document.route');  
// const facultyRoute = require('./faculty.route');
const courseRoute = require('./course.route');
// const statsRoute = require('./stats.route');
const notificationRoute = require('./notification.route');
const { prefixLecturer } = require('../../configs/system');
const permission = require('../../middlewares/permission.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');

module.exports = (app) => {
    app.use(authMiddleware.isAuth);
    app.use(prefixLecturer + '/classes', classRoute);
    app.use(prefixLecturer + '/documents', documentRoute);
    app.use(prefixLecturer + '/courses', courseRoute);
    app.use(prefixLecturer + '/notifications', notificationRoute);
}