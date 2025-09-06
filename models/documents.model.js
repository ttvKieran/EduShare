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
        enum: ["curriculum", "lecture", "exercise", "reference", "other"],
        default: "other"
    },
    tags: [String],
    category: String,
    allowDownload: {
        type: Boolean,
        default: false
    },
    // Thông tin file
    fileName: {
        type: String,
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileType: {
        type: String,
    },
    mimeType: {
        type: String,
        required: true
    },
    extension: {
        type: String,
    },
    isPreviewable: {
        type: Boolean,
        default: false
    },
    isDownload: String,
    previewUrl: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: ["active", "archived", "deleted", "published", "draft"],
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
    language: {
        type: String
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
    publishedAt: {
        type: Date,
        default: null
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
    driveFileId: { type: String },
    downloadUrl: { type: String },
}, {
    timestamps: true
});

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

    if (this.isPreviewable) {
        if (this.mimeType === 'application/pdf' || this.mimeType.startsWith('image/')) {
            this.previewUrl = this.previewUrl; 
        } 
    }

    next();
});

module.exports = mongoose.model("Document", documentSchema);