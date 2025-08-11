const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: 'dcj6ct5ea',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.upload = (req, res, next) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const fileExtension = require('path').extname(req.file.originalname).toLowerCase();
                const isOfficeFile = ['.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt'].includes(fileExtension);
                
                // Tạo public_id với extension để URL có đuôi file
                const publicId = `EduShare/${Date.now()}_${Math.random().toString(36).substring(2)}${fileExtension}`;
                
                const uploadOptions = {
                    resource_type: "raw",
                    folder: "EduShare",
                    public_id: publicId,
                    // Thêm headers để hỗ trợ preview
                    context: {
                        original_filename: req.file.originalname,
                        mime_type: req.file.mimetype
                    }
                };

                let stream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            try {
                let result = await streamUpload(req);
                
                // Tạo URL với đuôi file cho Office documents
                const fileExtension = require('path').extname(req.file.originalname).toLowerCase();
                let finalUrl = result.secure_url;
                
                // Nếu là Office file và URL chưa có đuôi file, thêm vào
                if (['.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt'].includes(fileExtension)) {
                    if (!finalUrl.endsWith(fileExtension)) {
                        finalUrl = finalUrl + fileExtension;
                    }
                }

                // Lưu thông tin file vào req.body
                req.body.cloudinaryUrl = finalUrl;
                req.body.originalCloudinaryUrl = result.secure_url;
                req.body.cloudinaryPublicId = result.public_id;
                req.body.fileName = req.file.originalname;
                req.body.fileSize = req.file.size;
                req.body.mimeType = req.file.mimetype;
                req.body.extension = fileExtension;
                req.body.fileType = fileExtension.substring(1).toLowerCase();

                next();
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "File upload failed",
                    error: error.message
                });
            }
        }
        upload(req);
    } else {
        next();
    }
};