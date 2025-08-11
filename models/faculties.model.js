const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    name: String,
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
// facultySchema.index({ code: 1 });
// facultySchema.index({ name: "text" });
// facultySchema.index({ dean: 1 });
// facultySchema.index({ status: 1, deleted: 1 });

const Faculty = mongoose.model("Faculty", facultySchema, "faculties");

module.exports = Faculty;