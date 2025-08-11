const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: String,
    academicYear: {
        type: String,
    },
    semester: {
        type: String,
    },
    status: {
        type: String,
        default: "active"
    }, // active, completed, canceled, deleted

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }, 
    // course: {
    //     courseId: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Course"
    //     },
    //     credits: Number,
    //     courseName: String
    // }, 
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
    studentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }], 
    documentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    }]
}, {
    timestamps: true
});

// Class Model Indexes
// classSchema.index({ deleted: 1, createdAt: -1 });
// classSchema.index({ courseId: 1, deleted: 1 });
// classSchema.index({ instructor: 1, deleted: 1 });
// classSchema.index({ "students": 1 });
// classSchema.index({ className: "text" });
// classSchema.index({ academicYear: 1, semester: 1, deleted: 1 });

const Class = mongoose.model("Class", classSchema, "classes");

module.exports = Class;