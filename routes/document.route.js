const express = require('express');
const routes = express.Router();
const documentController = require('../controllers/document.controller');
const permission = require('../middlewares/permission.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const documentValidate = require('../validates/documentValidate');
const multer = require('multer');
const upload = multer({ dest: 'C:\\temp' });

// GET - /documents
routes.get(
    '/', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']), 
    documentValidate.getDocument,
    documentController.get
);

// POST - /documents/create
routes.post(
    '/create', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']), 
    upload.single('document'),
    // uploadCloud.upload,
    documentValidate.createDocument,
    documentController.create
);

// GET - /documents/:id
routes.get(
    '/:id', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']), 
    documentValidate.getDocumentDetail,
    documentController.getDetail
)

// DELETE - /documents/:id
routes.delete(
    '/:id', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin']), 
    documentValidate.getDocumentDetail,
    documentController.delete
)

routes.get(
    '/download/:id',
    authMiddleware.isAuth,
    documentController.download
)

module.exports = routes;