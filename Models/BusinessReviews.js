const mongoose = require('mongoose');

const BusinessReview = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    rating: {type: Number, required: true},
    description: {type: String, trim: true, required: false},
    created : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('business-reviews', BusinessReview);