const mongoose = require('mongoose');

const SignedCart = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    size: {
        type: String, trim: true, default: ""
    },
    color: {
        type: String, trim: true, default: ""
    },
    quantity: {
        type: Number,
        default: 1
    },
    created : {
        type : Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('signed-cart', SignedCart);