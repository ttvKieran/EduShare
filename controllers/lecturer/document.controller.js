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
        const lecturerId = req.user._id;
        const filter = {
            "uploadedBy.user_id": lecturerId,
            ...(type && { type }),
            ...(courseId && { courseId }),
            ...(facultyId && { facultyId }),
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }),
            deleted: false,
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
        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi truy vấn tài liệu', error: error.message });
    }
}

module.exports.getDocumentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const documents = await Document.find({ courseId, deleted: false }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports.getDocumentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const lecturerId = req.user._id;
        const classExists = await Class.findOne({ _id: classId, instructorId: lecturerId });
        if (!classExists) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập tài liệu của lớp học này" });
        }
        const documents = await Document.find({ classId, deleted: false }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        res.status(500).json(error);
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
        res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật tài liệu", error: error.message });
    }
}

module.exports.uploadDocument = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      tags,
      status,
      allowDownload,
      authors,
    //   isForClass,
      courseId,
      classId,
    //   accessLevel = 'public',
    //   allowedRoles = ['student', 'lecturer'],
    //   allowedUsers = [],
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
      category: category || 'other',
      tags: JSON.parse(tags),
      allowDownload,
      authors: JSON.parse(authors),
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
    //   accessControl: {
    //     accessLevel,
    //     allowedRoles: Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles],
    //     allowedUsers: Array.isArray(allowedUsers) ? allowedUsers : []
    //   },
      status: status
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
    // res.status(200).json({success: true});
} catch (error) {
    console.log(error);
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
        console.log(document.uploadedBy.user_id.toString());
        console.log(req.user._id.toString());
        if (document.uploadedBy.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Không có quyền xóa tài liệu' });
        }
        document.status = 'deleted';
        document.deleted = true;
        await document.save();
        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa tài liệu', error: error.message });
    }
}

// GET - /documents/:id/preview/
module.exports.previewDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
       
        if (!document || document.deleted) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài liệu'
            });
        }

        if (!document.isPreviewable) {
            return res.status(400).json({
                success: false,
                message: 'Tài liệu không thể xem trước'
            });
        }

        // Tăng view count
        await Document.findByIdAndUpdate(id, {
            $inc: { viewCount: 1 }
        });

        // Tạo preview URL tối ưu
        let previewUrl = document.previewUrl;
        let fallbackPreviewUrl = null;
        let directUrl = document.cloudinaryUrl;

        // Xử lý đặc biệt cho Office files
        if (document.mimeType.includes('officedocument') || 
            document.mimeType.includes('msword') || 
            document.mimeType.includes('ms-excel') || 
            document.mimeType.includes('ms-powerpoint')) {
            
            // Tạo URL proxy qua server của bạn
            const proxyUrl = `${req.protocol}://${req.get('host')}/api/documents/${id}/file`;
            
            // Sử dụng nhiều viewer khác nhau
            const viewers = [
                // Google Docs Viewer
                `https://docs.google.com/viewer?url=${encodeURIComponent(proxyUrl)}&embedded=true`,
                // Microsoft Office Online (có thể không hoạt động với Cloudinary)
                `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(proxyUrl)}`,
                // Fallback - direct download
                proxyUrl
            ];
            
            previewUrl = viewers[0];
            fallbackPreviewUrl = viewers[1];
            directUrl = proxyUrl;
        }

        res.status(200).json({
  success: true,
  data: {
    previewUrl: document.previewUrl,
    title: document.title,
    fileType: document.fileType,
    mimeType: document.mimeType,
    cloudinaryUrl: document.cloudinaryUrl, // hoặc đổi thành `downloadUrl`
  }
});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xem trước tài liệu",
            error: error.message
        });
    }
};