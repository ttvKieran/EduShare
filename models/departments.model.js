const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String
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
// departmentSchema.index({ code: 1 }, { unique: true });
// departmentSchema.index({ name: "text" });
// departmentSchema.index({ facultyId: 1, deleted: 1 });
// departmentSchema.index({ "head.userId": 1 });
// departmentSchema.index({ "staff": 1 });

const Department = mongoose.model("Department", departmentSchema, "departments");

module.exports = Department;