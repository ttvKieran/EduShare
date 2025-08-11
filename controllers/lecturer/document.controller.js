const Document = require("../../models/documents.model");
const Class = require("../../models/classes.model");
const { validationResult } = require('express-validator');
// const redis = require("../../configs/connections_redis");
const { compress, decompress } = require('../../helpers/zstandard');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
// const Minio = require('minio');
// const minioClient = new Minio.Client({
//     endPoint: 'localhost',
//     port: 9000,
//     useSSL: false,
//     accessKey: 'minioadmin',
//     secretKey: 'minioadmin'
// });
// // Tạo bucket trong MinIO nếu chưa tồn tại
// const bucketName = "documents";
// minioClient.bucketExists(bucketName, function (err, exists) {
//     if (err) {
//         return console.log("Lỗi khi kiểm tra bucket:", err);
//     }
//     if (!exists) {
//         minioClient.makeBucket(bucketName, 'us-east-1', function (err) {
//             if (err) return console.log('Không thể tạo bucket.', err);
//             console.log('Bucket created successfully');
//         });
//     } else {
//         console.log('Bucket đã tồn tại.');
//     }
// });

// GET - /documents
module.exports.get = async (req, res) => {
    try {
        const { type, courseId, facultyId, search } = req.query;
        // Tạo cache key dựa trên các tham số tìm kiếm
        const cacheKey = `search:${courseId || ''}:${facultyId || ''}:${search || ''}:${type || ''}`;
        const cachedResults = await redis.client.get(cacheKey);
        if (cachedResults) {
            return res.json(JSON.parse(cachedResults));
        }
        const lecturerId = req.user._id;
        const filter = {
            // "uploadedBy.user_id": lecturerId,
            ...(type && { type }),
            ...(courseId && { courseId }),
            ...(facultyId && { facultyId }),
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }),
            status: 'active',
            // deleted: false,
            // $or: [
            //     { "accessControl.accessLevel": "public" }, 
            //     {"req.user.role": "admin" },
            //     // { "accessControl.allowedRoles": { $in: [req.user.role] } }, 
            //     // { "accessControl.allowedUsers": { $in: [req.user._id] } } 
            //     { "accessControl.allowedRoles": { $in: [req.user.role] } },
            //     // { "accessControl.allowedUsers": { $in: [req.user._id] } }
            // ]
        };
        console.log(filter);
        console.log(req.user.role);
        const documents = await Document.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit) || 20)
            .skip(parseInt(req.query.skip) || 0);
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi truy vấn tài liệu', error: error.message });
    }
}

module.exports.getDocumentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const lecturerId = req.user._id;
        const cacheKey = `course:${courseId}:documents`;
        // Kiểm tra xem giảng viên có dạy môn học này không
        const classExists = await Class.findOne({ courseId, instructor: lecturerId, deleted: false });
        if (!classExists) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập tài liệu của môn học này" });
        }
        // Kiểm tra cache Redis
        const cachedDocuments = await redis.client.get(cacheKey);
        if (cachedDocuments) {
            return res.json(JSON.parse(cachedDocuments));
        }
        // Không có cache, truy vấn từ MongoDB
        const documents = await Document.find({ courseId, status: "active" }).sort({ createdAt: -1 });
        // Lưu kết quả vào cache với TTL 15 phút
        await redis.client.set(cacheKey, JSON.stringify(documents), 'EX', 900);
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy tài liệu của môn học", error: error.message });
    }
};

module.exports.getDocumentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const lecturerId = req.user._id;
        // Kiểm tra xem giảng viên có dạy lớp học này không
        console.log(lecturerId);
        console.log(classId);
        const classExists = await Class.findOne({ _id: classId, instructor: lecturerId, deleted: false });
        if (!classExists) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập tài liệu của lớp học này" });
        }
        const documents = await Document.find({ classId, status: "active" }).sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy tài liệu của lớp học", error: error.message });
    }
};

// GET - /documents/:id
module.exports.getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Không tìm thấy tài liệu" });
        }
        // Kiểm tra quyền truy cập
        const hasAccess =
            document.accessControl.accessLevel === 'public' ||
            document.uploadedBy.user_id.toString() === req.user._id.toString() ||
            req.user.role === 'admin' ||
            document.accessControl.allowedRoles.includes(req.user.role) ||
            document.accessControl.allowedUsers.includes(req.user.id);
        if (!hasAccess) {
            return res.status(403).json({ message: 'Không có quyền truy cập tài liệu' });
        }
        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy tài liệu", error: error.message });
    }
}

// PATCH - /documents/:id
module.exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Không tìm thấy tài liệu" });
        }

        // Chỉ người tải lên hoặc admin mới được sửa
        if (document.uploadedBy.user_id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền sửa tài liệu này" });
        }
        Object.assign(document, updates);
        await document.save();
        res.status(200).json({ message: "Cập nhật tài liệu thành công", document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật tài liệu", error: error.message });
    }
}

// POST - /documents/upload
// module.exports.uploadDocument = async (req, res) => {
//     try{
//             const {
//                 name, description, type,
//                 courseId, classId, version, language
//             } = req.body;
//             console.log(req.body);
//             const document = new Document({
//                 name,
//                 description,
//                 type,
//                 uploadedBy: { user_id: req.user._id },
//                 path: req.body.document,
//                 size: req.file.size,
//                 extension: path.extname(req.file.originalname),
//                 courseId: courseId || null,
//                 classId: classId || null,
//                 accessControl: {
//                     accessLevel: req.body.accessLevel || 'restricted',
//                     allowedRoles: req.body.allowedRoles ? req.body.allowedRoles : ['student', 'lecturer']
//                 },
//                 language,
//                 version
//             });
//             console.log(document);
//             await document.save();
//             res.status(200).json({ message: 'File uploaded' });
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
// };
// module.exports.uploadDocument = async (req, res) => {
//     try {

//         const {
//             title,
//             description,
//             type,
//             courseId,
//             classId,
//             accessLevel = 'public',
//             allowedRoles = ['student', 'lecturer'],
//             allowedUsers = []
//         } = req.body;

//         // Kiểm tra file đã được upload qua middleware chưa
//         if (!req.body.cloudinaryUrl) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Không tìm thấy file được upload'
//             });
//         }

//         // Tạo document mới
//         const document = new Document({
//             title: title || req.body.fileName.split('.').slice(0, -1).join('.'),
//             description,
//             type: type || 'other',
//             fileName: req.body.fileName,
//             fileSize: req.body.fileSize,
//             fileType: req.body.fileType,
//             originalCloudinaryUrl: req.body.originalCloudinaryUrl,
//             mimeType: req.body.mimeType,
//             extension: req.body.extension,
//             cloudinaryUrl: req.body.cloudinaryUrl,
//             cloudinaryPublicId: req.body.cloudinaryPublicId,
//             uploadedBy: {
//                 user_id: req.user._id,
//                 uploadedAt: new Date()
//             },
//             courseId: courseId ? (Array.isArray(courseId) ? courseId : [courseId]) : [],
//             classId: classId ? (Array.isArray(classId) ? classId : [classId]) : [],
//             accessControl: {
//                 accessLevel,
//                 allowedRoles: Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles],
//                 allowedUsers: Array.isArray(allowedUsers) ? allowedUsers : []
//             },
//             status: 'active',
//             deleted: false
//         });

//         await document.save();

//         // Populate thông tin liên quan
//         await document.populate([
//             { path: 'uploadedBy.user_id', select: 'name email' },
//             { path: 'courseId', select: 'name code' },
//             { path: 'classId', select: 'className' }
//         ]);

//         res.status(201).json({
//             success: true,
//             message: 'Upload tài liệu thành công',
//             data: document
//         });

//     } catch (error) {
//         console.error('Upload error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Lỗi khi upload tài liệu',
//             error: error.message
//         });
//     }
// };
module.exports.uploadDocument = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      courseId,
      classId,
      accessLevel = 'public',
      allowedRoles = ['student', 'lecturer'],
      allowedUsers = []
    } = req.body;

    if (!req.body.previewUrl || !req.body.downloadUrl) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy file đã upload lên Google Drive'
      });
    }

    const document = new Document({
      title: title || req.body.fileName.split('.').slice(0, -1).join('.'),
      description,
      type: type || 'other',
      fileName: req.body.fileName,
      fileSize: req.body.fileSize,
      fileType: req.body.fileType,
      mimeType: req.body.mimeType,
      extension: req.body.extension,
      previewUrl: req.body.previewUrl,
      downloadUrl: req.body.downloadUrl,
      driveFileId: req.body.driveFileId,
      uploadedBy: {
        user_id: req.user._id,
        uploadedAt: new Date()
      },
      courseId: courseId ? (Array.isArray(courseId) ? courseId : [courseId]) : [],
      classId: classId ? (Array.isArray(classId) ? classId : [classId]) : [],
      accessControl: {
        accessLevel,
        allowedRoles: Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles],
        allowedUsers: Array.isArray(allowedUsers) ? allowedUsers : []
      },
      status: 'active',
      deleted: false
    });

    await document.save();

    await document.populate([
      { path: 'uploadedBy.user_id', select: 'name email' },
      { path: 'courseId', select: 'name code' },
      { path: 'classId', select: 'className' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Upload tài liệu thành công',
      data: document
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload tài liệu',
      error: error.message
    });
  }
};

// DELETE - /documents/:id
module.exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
        }
        // Chỉ người tải lên hoặc admin mới được xóa
        // console.log(document.uploadedBy.user_id.toString());
        if (document.uploadedBy.user_id.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền xóa tài liệu' });
        }
        document.status = 'deleted';
        document.deleted = true;
        await document.save();
        res.json({ message: 'Xóa tài liệu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa tài liệu', error: error.message });
    }
}

// GET - /documents/preview/:id
module.exports.previewDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const compressedPath = `C:\\temp\\${document._id}.zst`;
        const decompressedPath = `C:\\temp\\${document._id}`;
        // Lấy tệp nén từ MinIO
        await minioClient.fGetObject('documents', document.compressedPath.split('/')[1], compressedPath);
        // Giải nén
        decompress(compressedPath, decompressedPath, async (err, output) => {
            if (err) {
                await fs.unlink(compressedPath).catch(() => { });
                return res.status(500).json({ error: err.message });
            }
            try {
                // Thiết lập header để hiển thị inline (cho PDF)
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${document.title}${document.extension}"`);

                // Gửi tệp dưới dạng stream
                const fileStream = require('fs').createReadStream(output);
                fileStream.pipe(res);

                // Xử lý sự kiện khi stream kết thúc hoặc lỗi
                fileStream.on('end', async () => {
                    await fs.unlink(compressedPath).catch(() => { });
                    await fs.unlink(decompressedPath).catch(() => { });
                });

                fileStream.on('error', async (err) => {
                    await fs.unlink(compressedPath).catch(() => { });
                    await fs.unlink(decompressedPath).catch(() => { });
                    res.status(500).json({ error: `Preview failed: ${err.message}` });
                });
            } catch (err) {
                await fs.unlink(compressedPath).catch(() => { });
                await fs.unlink(decompressedPath).catch(() => { });
                res.status(500).json({ error: err.message });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};