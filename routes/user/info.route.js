const express = require('express');
const routes = express.Router();
const infoUserController = require('../../controllers/user/info.controller');
const userValidate = require('../../validates/userValidate');
const authMiddleware = require('../../middlewares/auth.middleware');

// GET - /user/detail/:user_id
routes.get('/detail/:user_id', authMiddleware.isAuth, infoUserController.userDetail);

// PATCH - /user/edit/:user_id
routes.patch('/edit/:user_id', authMiddleware.isAuth, infoUserController.userEdit);

module.exports = routes;