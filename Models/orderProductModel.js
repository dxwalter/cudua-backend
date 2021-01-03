const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    customer: {
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
        type: String, trim: true
    },
    color: {
        type: String, trim: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    order_id: {
        type: String,
        required: true
    },
    created : {
        type : Date,
        default: Date.now
    }
});


module.exports = mongoose.model('order-products', OrderSchema);