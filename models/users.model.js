const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        require: true
    },
    password: String,
    birthDate: String,
    fullName: String,
    phoneNumber: String,
    address: String,
    role: {
        type: String,
        default: "student"
    }, // student, lecturer, admin, academic
    refreshToken: String,
    userCode: String,
    positioin: String,
    note: String,
    status: {
        type: String,
        default: "active"
    },

    facultyIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }],
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    classIds: [{
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class"
        },
        courseName: String,
        credits: Number,
        courseType: String,
        semester: Number
    }],
    administrativeClass: {
        administrativeClassId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        code: String
    },
}, {
    timestamps: true
});

// User Model Indexes
// userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
