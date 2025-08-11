const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ["lecture", "exercise", "reference", "other"],
        default: "other"
    },
    // Thông tin file từ Cloudinary
    fileName: {
        type: String,
        // required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileType: {
        type: String,
        // required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    extension: {
        type: String,
        // required: true
    },
    cloudinaryUrl: {
        type: String,
        // required: true
    },
    cloudinaryPublicId: {
        type: String,
        // required: true
    },
    // Khả năng xem trước
    isPreviewable: {
        type: Boolean,
        default: false
    },
    previewUrl: {
        type: String,
        default: null
    },
    // Thông tin khác
    status: {
        type: String,
        enum: ["active", "archived", "deleted"],
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    // Quan hệ
    authors: [
        {
            name: {
                type: String,
                required: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    averageRating: Number,
    publishedAt: {
        type: Date,
        default: null // hoặc bạn có thể yêu cầu người upload nhập nếu cần
    },
    uploadedBy: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    courseId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    classId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    }],
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    accessControl: {
        accessLevel: {
            type: String,
            enum: ["public", "restricted", "private"],
            default: "public"
        },
        allowedRoles: [String],
        allowedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    originalCloudinaryUrl: {
        type: String,
        // required: true
    },
    driveFileId: { type: String },
    downloadUrl: { type: String },
}, {
    timestamps: true
});

// Pre-save middleware để tự động set isPreviewable và previewUrl
// documentSchema.pre('save', function(next) {
//     // Kiểm tra file có thể xem trước không
//     const previewableTypes = [
//         'application/pdf',
//         'image/jpeg',
//         'image/jpg',
//         'image/png',
//         'image/gif',
//         'image/webp',
//         'text/plain',
//         'text/html',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'application/vnd.ms-excel',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         'application/vnd.ms-powerpoint',
//         'application/vnd.openxmlformats-officedocument.presentationml.presentation'
//     ];

//     this.isPreviewable = previewableTypes.includes(this.mimeType);

//     if (this.isPreviewable) {
//         // Tạo preview URL dựa trên loại file
//         if (this.mimeType === 'application/pdf' || this.mimeType.startsWith('image/')) {
//             this.previewUrl = this.cloudinaryUrl;
//         } else {
//             // Office documents qua Google Docs Viewer
//             this.previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(this.cloudinaryUrl)}&embedded=true`;
//         }
//     }

//     next();
// });
// documentSchema.pre('save', function(next) {
//     // Kiểm tra file có thể xem trước không
//     const previewableTypes = [
//         'application/pdf',
//         'image/jpeg',
//         'image/jpg',
//         'image/png',
//         'image/gif',
//         'image/webp',
//         'image/svg+xml',
//         'text/plain',
//         'text/html',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'application/vnd.ms-excel',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         'application/vnd.ms-powerpoint',
//         'application/vnd.openxmlformats-officedocument.presentationml.presentation'
//     ];

//     this.isPreviewable = previewableTypes.includes(this.mimeType);

//     if (this.isPreviewable) {
//         // Tạo preview URL dựa trên loại file
//         if (this.mimeType === 'application/pdf') {
//             // PDF có thể xem trực tiếp từ Cloudinary
//             this.previewUrl = this.cloudinaryUrl;
//         } else if (this.mimeType.startsWith('image/')) {
//             // Hình ảnh xem trực tiếp
//             this.previewUrl = this.cloudinaryUrl;
//         } else if (this.mimeType.includes('officedocument') || 
//                   this.mimeType.includes('msword') || 
//                   this.mimeType.includes('ms-excel') || 
//                   this.mimeType.includes('ms-powerpoint')) {
//             // Office documents - tạo URL với đuôi file rõ ràng
//             const fileExtension = this.extension;
//             const cloudinaryUrlWithExt = `${this.cloudinaryUrl}${fileExtension}`;

//             // Sử dụng Microsoft Office Online Viewer
//             this.previewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cloudinaryUrlWithExt)}`;
//         } else {
//             // Fallback cho text files
//             this.previewUrl = this.cloudinaryUrl;
//         }
//     } else {
//         this.previewUrl = null;
//     }

//     next();
// });
documentSchema.pre('save', function (next) {
    const previewableTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'text/plain',
        'text/html',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    this.isPreviewable = previewableTypes.includes(this.mimeType);

    // if (this.isPreviewable) {
    //     if (this.mimeType === 'application/pdf') {
    //         this.previewUrl = this.cloudinaryUrl;
    //     } else if (this.mimeType.startsWith('image/')) {
    //         this.previewUrl = this.cloudinaryUrl;
    //     } else if (this.mimeType.includes('officedocument') || 
    //               this.mimeType.includes('msword') || 
    //               this.mimeType.includes('ms-excel') || 
    //               this.mimeType.includes('ms-powerpoint')) {
    //         // Để controller xử lý dynamic URL
    //         this.previewUrl = null;
    //     } else {
    //         this.previewUrl = this.cloudinaryUrl;
    //     }
    // } else {
    //     this.previewUrl = null;
    // }

    if (this.isPreviewable) {
        if (this.mimeType === 'application/pdf' || this.mimeType.startsWith('image/')) {
            this.previewUrl = this.previewUrl; // Đã set từ middleware
        } 
        // else {
        //     this.previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(this.downloadUrl)}&embedded=true`;
        // }
    }

    next();
});

module.exports = mongoose.model("Document", documentSchema);