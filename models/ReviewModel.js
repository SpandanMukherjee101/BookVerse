const mongoose = require("mongoose");

const ReSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        },
        required: true
    },

    review: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('reviews', ReSchema);