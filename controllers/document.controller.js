const Document = require("../models/documents.model");
const { validationResult } = require('express-validator');
const redis = require("../configs/connections_redis");
const Minio = require('minio');
const { compress, decompress } = require('../helpers/zstandard');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

// Kết nối MinIO
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});
// Tạo bucket trong MinIO nếu chưa tồn tại
const bucketName = "documents";

minioClient.bucketExists(bucketName, function(err, exists) {
  if (err) {
    return console.log("Lỗi khi kiểm tra bucket:", err);
  }

  if (!exists) {
    minioClient.makeBucket(bucketName, 'us-east-1', function(err) {
      if (err) return console.log('Không thể tạo bucket.', err);
      console.log('Bucket created successfully');
    });
  } else {
    console.log('Bucket đã tồn tại.');
  }
});

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
    const filter = {
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
      $or: [
        { 'accessControl.accessLevel': 'public' },
        { 'accessControl.allowedRoles': { $in: [req.user.role] } },
        { 'req.user.role': "admin" },
        { 'accessControl.allowedUsers': { $in: [req.user.id] } }
      ]
    };
    const documents = await Document.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 20)
      .skip(parseInt(req.query.skip) || 0);

    // Lưu kết quả vào cache với TTL 5 phút
    await redis.client.set(cacheKey, JSON.stringify(documents), 'EX', 300);

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi truy vấn tài liệu', error: error.message });
  }
}

// POST - /documents/create
module.exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const inputFile = req.file.path;
  const compressedPath = `C:\\temp\\${req.file.filename}.zst`;
  compress(inputFile, compressedPath, 22, async (err, output) => {
    if (err) {
      await fs.unlink(inputFile).catch(() => { });
      return res.status(500).json({ error: err.message });
    }
    try {
      await minioClient.fPutObject(bucketName, `${req.file.filename}.zst`, compressedPath);
      const {
        title, description, type, authors,
        courseId, facultyId, departmentId
      } = req.body;
      const userId = req.user._id;
      // Chuyển đổi authors.userId từ String sang ObjectId
      const parsedAuthors = authors
      ? JSON.parse(authors).map(author => ({
            ...author,
            userId: mongoose.Types.ObjectId.isValid(author.userId)
                ? mongoose.Types.ObjectId(author.userId)
                : undefined // Bỏ qua nếu userId không hợp lệ
        }))
      : [];
      const document = new Document({
        title,
        description,
        type,
        authors: parsedAuthors,
        uploadedBy: { user_id: userId } ,
        // fileDetails: {
        //   fileName: req.file.originalname,
        //   fileSize: req.file.size,
        //   fileType: req.file.mimetype,
        //   filePath: req.body[req.file.fieldname]
        // },
        compressedPath: `${bucketName}/${req.file.filename}.zst`,
        originalSize: req.file.size,
        compressedSize: (await fs.stat(compressedPath)).size,
        extension: path.extname(req.file.originalname),
        courseId,
        facultyId: facultyId || req.user.facultyId,
        departmentId: departmentId || req.user.departmentId,
        accessControl: {
          accessLevel: req.body.accessLevel || 'restricted',
          allowedRoles: req.body.allowedRoles ? req.body.allowedRoles : ['student', 'lecturer']
        }
      });
      await document.save();
      await fs.unlink(inputFile);
      await fs.unlink(compressedPath);
      res.status(200).json({ message: 'File uploaded and compressed' });
    } catch (err) {
      await fs.unlink(inputFile).catch(() => { });
      await fs.unlink(compressedPath).catch(() => { });
      res.status(500).json({ error: err.message });
    }
  });
};

// GET - /documents/:id
module.exports.getDetail = async (req, res) => {
  try {
    const {documentId} = req.params;
    const cacheKey = `document:${documentId}`;
    // Kiểm tra cache
    const cachedDocument = await redis.client.get(cacheKey);
    if (cachedDocument) {
      return res.json(JSON.parse(cachedDocument));
    }
    // Không có cache, truy vấn từ MongoDB
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    // Kiểm tra quyền truy cập
    const hasAccess =
      document.accessControl.accessLevel === 'public' ||
      document.accessControl.allowedRoles.includes(req.user.role) ||
      document.accessControl.allowedUsers.includes(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Không có quyền truy cập tài liệu' });
    }
    await document.save();
    // Lưu kết quả vào cache với TTL 1 giờ
    await redis.client.set(cacheKey, JSON.stringify(document), 'EX', 3600);
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy thông tin tài liệu', error: error.message });
  }
}

// DELETE - /documents/:id
module.exports.delete = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }
    // Chỉ người tải lên hoặc admin mới được xóa
    if (document.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa tài liệu' });
    }
    document.status = 'deleted';
    await document.save();
    res.json({ message: 'Xóa tài liệu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa tài liệu', error: error.message });
  }
}

// GET - /documents/download/:id
module.exports.download = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const compressedPath = `C:\\temp\\${document._id}.zst`; // Dùng C:\temp trên Windows
    const decompressedPath = `C:\\temp\\${document._id}`;
    // Lấy tệp nén từ MinIO
    await minioClient.fGetObject('documents', document.compressedPath.split('/')[1], compressedPath);
    // Sử dụng hàm decompress từ zstd.js để giải nén
    decompress(compressedPath, decompressedPath, async (err, output) => {
      if (err) {
        await fs.unlink(compressedPath).catch(() => {});
        return res.status(500).json({ error: err.message });
      }
      try {
        // Gửi tệp gốc cho sinh viên
        res.download(output, `${document.title}${document.extension}`, async (err) => {
          if (err) {
            await fs.unlink(compressedPath).catch(() => {});
            await fs.unlink(decompressedPath).catch(() => {});
            return res.status(500).json({ error: err.message });
          }
          // Xóa tệp tạm sau khi gửi
          await fs.unlink(compressedPath);
          await fs.unlink(decompressedPath);
        });
      } catch (err) {
        await fs.unlink(compressedPath).catch(() => {});
        await fs.unlink(decompressedPath).catch(() => {});
        res.status(500).json({ error: err.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}