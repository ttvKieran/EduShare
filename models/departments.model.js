const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    deleted: {
        type: Boolean,
        default: false
    },

    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    }, 
}, {
    timestamps: true
});

// Department Model Indexes
// departmentSchema.index({ deleted: 1, createdAt: -1 });

const Department = mongoose.model("Department", departmentSchema, "departments");

module.exports = Department;