const express = require('express');
const routes = express.Router();
const infoUserController = require('../../controllers/user/info.controller');
const infoUserValidate = require('../../validates/user/infoValidate');
const authMiddleware = require('../../middlewares/auth.middleware');
const handleValidation = require("../../middlewares/handleValidate.middleware");

// GET - /user/detail/:user_id
routes.get('/detail/:user_id', authMiddleware.isAuth, infoUserController.userDetail);

// PATCH - /user/edit/:user_id
routes.patch('/edit/:user_id', infoUserValidate.edit, handleValidation, authMiddleware.isAuth, infoUserController.userEdit);

module.exports = routes;