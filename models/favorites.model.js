const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema({
    type: String,
    deleted: {
        type: Boolean,
        default: false
    }, 
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
});

const Favorite = mongoose.model("Favorite", favoriteSchema, "favorites");

module.exports = Favorite;