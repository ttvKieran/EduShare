const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    description: String,
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

// Faculty Model Indexes
// facultySchema.index({ deleted: 1, createdAt: -1 });

const Faculty = mongoose.model("Faculty", facultySchema, "faculties");

module.exports = Faculty;