const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
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
    },
    schedule: [
        {
            dayOfWeek: Number,
            timeStart: String,
            timeEnd: String,
            classroom: String
        }
    ],

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }, 
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

const Class = mongoose.model("Class", classSchema, "classes");

module.exports = Class;