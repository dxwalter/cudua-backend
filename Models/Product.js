const mongoose = require('mongoose');

const Product = mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String},
    sizes: [{type: Number}],
    colors: [{type: String}],
    brand: {type: String},
    hide: {type: Number},
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