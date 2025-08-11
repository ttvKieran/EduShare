const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        require: true
    },
    password: String,
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
    }, // active, inactive, suspended, deleted

    facultyIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }],
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    classes: [{
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class"
        },
        courseName: String,
        credits: Number,
        courseType: String,
        semester: Number
    }]
}, {
    timestamps: true
});

// User Model Indexes
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ deleted: 1, createdAt: -1 });
// userSchema.index({ role: 1, deleted: 1 });
// userSchema.index({ studentId: 1 }, { sparse: true });
// userSchema.index({ staffId: 1 }, { sparse: true });
// userSchema.index({ status: 1, deleted: 1 });
// userSchema.index({ facultyId: 1, deleted: 1 });
// userSchema.index({ departmentId: 1, deleted: 1 });

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
