const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    description: String,
    credits: {
        type: Number
    },
    courseType: String,
    maxStudents: Number,
    code: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,

    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
    prerequisites: [{
        courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
        },
        name: String,
        code: String,
    }],
    documentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    }],
    classIds: [{
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class"
        },
        status: String
    }],
}, {
    timestamps: true
});

// Course Model Indexes
// courseSchema.index({ deleted: 1, createdAt: -1 });

const Course = mongoose.model("Course", courseSchema, "courses");

module.exports = Course;