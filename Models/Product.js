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
        type: String, default: ""
    },
    sizes: [{ 
        sizes: {type: String, trim: true}
    }],
    colors: [{ 
        color_codes: {type: String, trim: true} 
    }],
    brand: { type: String },
    hide: { type: Number },
    tags: [{
        tag_name : { type: String, trim: true }
    }],
    score: {
        type: Number,
        default: 0
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
});

Product.virtual('ProductReviewList', {
    ref: 'product-review',
    localField: '_id',
    foreignField: 'product_id',
    justOne: false,
})

Product.set('toObject', { virtuals: true });
Product.set('toJSON', { virtuals: true });


module.exports = mongoose.model('product', Product);