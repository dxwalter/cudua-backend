const mongoose = require('mongoose');

const ProductReview = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    rating: {type: Number, required: true},
    description: {type: String, trim: true, required: false},
    created : {
        type : Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('product-review', ProductReview);