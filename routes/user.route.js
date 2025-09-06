const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user.controller');
const userValidate = require('../validates/userValidate');
const authMiddleware = require('../middlewares/auth.middleware');

// POST - /user/login
routes.post('/login', userController.login);

// POST - /user/refresh
routes.post('/refresh', userController.refreshToken);

// GET - /user/logout
routes.get('/logout', userController.logout);

// // GET - /user/forgot
// routes.get('/password/forgot', userController.forgot);

// // POST - /user/password/forgot
// routes.post('/password/forgot', userValidate.forgot, userController.forgotPost);

// // GET - /user/password/otp
// routes.get('/password/otp', userController.otpPassword);

// // POST - /user/password/otp
// routes.post('/password/otp', userController.otpPasswordPost);

// // GET - /user/password/reset
// routes.get('/password/reset', userController.reset);

// // POST - /user/password/reset
// routes.post('/password/reset', userValidate.reset, userController.resetPost);

// GET - /user/detail/:user_id
routes.get('/detail/:user_id', authMiddleware.isAuth, userController.userDetail);

// PATCH - /user/edit/:user_id
routes.patch('/edit/:user_id', authMiddleware.isAuth, userController.userEdit);

module.exports = routes;