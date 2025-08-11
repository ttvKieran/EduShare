const express = require('express');
const classRoute = require('./class.route');
const departmentRoute = require('./department.route');  
const facultyRoute = require('./faculty.route');
const courseRoute = require('./course.route');
const statsRoute = require('./stats.route');
const userRoute = require('./user.route');
const { prefixAdmin } = require('../../configs/system');
const permission = require('../../middlewares/permission.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');

module.exports = (app) => {
    app.use(authMiddleware.isAuth);
    app.use(prefixAdmin + '/classes', classRoute);
    app.use(prefixAdmin + '/departments', departmentRoute);
    app.use(prefixAdmin + '/faculties', facultyRoute);
    app.use(prefixAdmin + '/courses', courseRoute);
    app.use(prefixAdmin + '/stats', statsRoute);
    app.use(prefixAdmin + '/users', userRoute);
}