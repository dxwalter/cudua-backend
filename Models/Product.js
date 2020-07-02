const mongoose = require('mongoose');

const Product = mongoose.Schema({
    name: {
        type: String, required: true, trim: true
    },
    price: {
        type: Number, required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategories",
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    primary_image: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    sizes: [
        { type: String, trim: true}
    ],
    colors: [{ type: String, trim: true }],
    brand: { type: String },
    hide: { type: Number },
    tags: [{ type: String, trim: true }],
    review_details: {
        reviews: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product-review",
            required: false
        },
        score: Number
    },
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    hide: {
        type: Number,
        default: 0
    },
    created : {
        type : Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('product', Product);