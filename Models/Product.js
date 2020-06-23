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
    main_image: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    sizes: [
        {
            type: Number
        }
    ],
    colors: [
        {
            type: String
        }
    ],
    brand: {
        type: String
    },
    hide: {
        type: Number
    },
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product-review",
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('product', Product);