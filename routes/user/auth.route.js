const express = require('express');
const routes = express.Router();
const userController = require('../../controllers/user/auth.controller');
const userValidate = require('../../validates/userValidate');
const authMiddleware = require('../../middlewares/auth.middleware');

// POST - /user/login
routes.post('/login', userController.login);

// POST - /user/refresh
routes.post('/refresh', userController.refreshToken);

// GET - /user/logout
routes.post('/logout', authMiddleware.isAuth, userController.logout);

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

module.exports = routes;