const express = require('express');
const userRoutes = require('./auth.route');
const infoUserRoutes = require('./info.route');

module.exports = (app) => {
    app.use('/user', userRoutes);
    app.use('/infoUser', infoUserRoutes);
}