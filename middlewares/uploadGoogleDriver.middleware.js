const path = require('path');
const { uploadToDrive } = require('../helpers/uploadGoogleDriver.js');

module.exports.upload = async (req, res, next) => {
  if (!req.file) return next();
  console.log("REQ: ", req.body.title);
  try {
    const result = await uploadToDrive(
      req.file.buffer,
      req.body.title,
      req.file.mimetype
    );

    // Lưu thông tin vào req.body để insert vào MongoDB
    req.body.driveFileId = result.id;
    // req.body.previewUrl = result.webViewLink;
    req.body.previewUrl = `https://drive.google.com/file/d/${result.id}/preview`;
    req.body.downloadUrl = result.webContentLink;
    req.body.fileName = result.name;
    req.body.fileSize = req.file.size;
    req.body.mimeType = result.mimeType;
    req.body.extension = path.extname(result.name);
    req.body.fileType = path.extname(result.name).slice(1).toLowerCase();
    req.body.isPreviewable = true; // tạm thời, bạn có thể xử lý sau

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload Google Drive thất bại", error: error.message });
  }
};
