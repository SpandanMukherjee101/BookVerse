const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    author: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    genre: [{
        type: String,
        required: true
    }],

    published: {
        type: Number,
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('books', BookSchema);