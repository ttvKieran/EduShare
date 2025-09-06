const express = require('express');
const userRoutes = require('./user.route');
const documentRoutes = require('./document.route');

module.exports = (app) => {
    app.use('/user', userRoutes);
    app.use('/documents', documentRoutes);
}