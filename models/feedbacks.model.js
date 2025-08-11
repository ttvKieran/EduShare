const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const feedbackSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true
    },
    isParent: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    deleted: {
        type: Boolean,
        default: false
    }, 
    
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    },
    reviewer: {
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        position: String,
        name: String
    },
    reply: [
        {
            feedbackId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Feedback"
            }
        }
    ]
}, {
    timestamps: true
});

const Feedback = mongoose.model("Feedback", feedbackSchema, "feedbacks");

module.exports = Feedback;