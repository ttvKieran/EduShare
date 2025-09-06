const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const notificationSchema = new mongoose.Schema({
    author: { 
        authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        name: String
    },
    course: {
        courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
        name: String
    },
    class: {
        classId: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
        name: String
    },
    type: { type: String },
    document: { 
        documentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
        name: String
    },
    title: { type: String, required: true },
    content: { type: String },
    priority: { type: String },
    isNew: { type: Boolean, default: true },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema, "notifications");

module.exports = Notification;