const express = require('express');
const userRoutes = require('./auth.route');

module.exports = (app) => {
    app.use('/user', userRoutes);
}