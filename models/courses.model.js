const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: String,
    credits: {
        type: Number
    },
    courseType: String,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    documentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    }]
}, {
    timestamps: true
});

// Course Model Indexes
// courseSchema.index({ deleted: 1, createdAt: -1 });
// courseSchema.index({ code: 1 }, { unique: true });
// courseSchema.index({ name: "text" });

const Course = mongoose.model("Course", courseSchema, "courses");

module.exports = Course;