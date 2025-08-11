// const express = require('express');
// const routes = express.Router();
// const documentController = require('../../controllers/student/document.controller');
// const permission = require('../../middlewares/permission.middleware');
// const authMiddleware = require('../../middlewares/auth.middleware');
// const documentValidate = require('../../validates/student/documentValidate');
// const handleValidation = require("../../middlewares/handleValidate.middleware");
// routes.use(permission.checkPermission(['admin', 'lecturer', 'student']));
// // GET - /students/documents
// routes.get(
//     '/', 
//     authMiddleware.isAuth,
//     permission.checkPermission(['admin', 'lecturer', 'student']), 
//     documentValidate.getAllDocuments,
//     handleValidation,
//     documentController.getAllDocuments
// );

// // GET - /students/documents/class/:classId
// routes.get(
//     '/class/:classId',
//     authMiddleware.isAuth,
//     permission.checkPermission(['admin', 'lecturer', 'student']),
//     documentValidate.getDocumentsByClass,
//     handleValidation,
//     documentController.getDocumentsByClass
// );

// // GET - /students/documents/:id
// routes.get(
//     '/:id', 
//     authMiddleware.isAuth,
//     permission.checkPermission(['admin', 'lecturer', 'student']), 
//     documentValidate.getDocumentById,
//     handleValidation,
//     documentController.getDocumentById
// );

// // GET - /students/documents/download/:id
// routes.get(
//     '/download/:id',
//     authMiddleware.isAuth,
//     permission.checkPermission(['admin', 'lecturer', 'student']),
//     documentValidate.download,
//     handleValidation, 
//     documentController.download
// )

// // GET - /lecturer/documents/preview/:id
// routes.get(
//     '/preview/:id', 
//     authMiddleware.isAuth,
//     permission.checkPermission(['admin', 'lecturer', 'student']), 
//     documentValidate.previewDocument,
//     handleValidation,
//     documentController.previewDocument
// )

// module.exports = routes;

const express = require('express');
const router = express.Router();
const documentController = require('../../controllers/student/document.controller');
const { isAuth } = require('../../middlewares/auth.middleware');
const { checkPermission } = require('../../middlewares/permission.middleware');

router.get('/', 
  isAuth,
  checkPermission(['student']),
  documentController.getAllDocuments
);

router.get('/favorites', 
  isAuth,
  checkPermission(['student']),
  documentController.getFavorites
);

router.get('/:id',
  isAuth,
  checkPermission(['student']),
  documentController.getDocumentById
);

router.get('/:id/preview',
  isAuth,
  checkPermission(['student']),
  documentController.previewDocument
);

// Route để serve file với headers đúng
router.get('/:id/file', documentController.serveFile);

router.get('/:id/download',
  isAuth,
  checkPermission(['student']),
  documentController.downloadDocument
);

router.post('/:documentId/favorite', documentController.favoritePost);

router.delete('/:documentId/favorite', documentController.favoriteDelete);

module.exports = router;