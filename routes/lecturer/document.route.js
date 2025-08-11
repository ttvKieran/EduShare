const express = require('express');
const routes = express.Router();
const documentController = require('../../controllers/lecturer/document.controller');
const permission = require('../../middlewares/permission.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const multer = require('multer');
// const upload = multer({ dest: 'C:\\temp' });
const fileUpload = multer();
const uploadCloud = require('../../middlewares/uploadCloudinary.middleware');
const uploadGoogleDrive = require('../../middlewares/uploadGoogleDriver.middleware');
const handleValidation = require("../../middlewares/handleValidate.middleware");
const documentValidate = require('../../validates/lecturer/documentValidate');

// routes.use(permission.checkPermission(['admin', 'lecturer']));

// GET - /lecturer/documents
routes.get(
    '/', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']), 
    // documentValidate.getDocuments,
    handleValidation,
    documentController.get
);

// GET - /lecturer/documents/course/:id
routes.get(
    '/course/:courseId', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']), 
    // documentValidate.getDocumentsByCourse,
    handleValidation,
    documentController.getDocumentsByCourse
);

// GET - /lecturer/documents/class/:id
routes.get(
    '/class/:classId',
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']),
    // documentValidate.getDocumentsByClass,
    handleValidation,
    documentController.getDocumentsByClass
);

// GET - /lecturer/documents/:id
routes.get(
    '/:id', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer', 'student']), 
    // documentValidate.getDocumentById,
    handleValidation,
    documentController.getDocumentById
)

// POST - /lecturer/documents/upload
// routes.post(
//     '/upload', 
//     authMiddleware.isAuth,
//     fileUpload.single('file'),
//     uploadCloud.upload,
//     documentController.uploadDocument
// );
routes.post(
  '/upload', 
  authMiddleware.isAuth,
  fileUpload.single('file'),
  uploadGoogleDrive.upload, // middleware mới
  documentController.uploadDocument
);

// PATCH - /lecturer/documents/:id 
routes.patch(
    '/:id', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']), 
    // documentValidate.updateDocument, 
    handleValidation,
    documentController.updateDocument
)

// DELETE - /lecturer/documents/:id
routes.delete(
    '/:id', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']),
    // documentValidate.deleteDocument, 
    handleValidation,
    documentController.deleteDocument
)

// GET - /lecturer/documents/preview/:id
routes.get(
    '/preview/:id', 
    authMiddleware.isAuth,
    permission.checkPermission(['admin', 'lecturer']), 
    // documentValidate.previewDocument,
    handleValidation,
    documentController.previewDocument
)

module.exports = routes;