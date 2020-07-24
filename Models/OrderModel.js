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
    delivery_charge: {
        type: Number,
        default: 0,
        required: false
    },
    order_status: {
        type: Number,
        /**
         * 0 means pending
         * 1 means confirmed
         * -1 means rejected
        */
        default: 0,
    },
    reject_order_reason: {
        type: String, trim: true
    },
    delivery_status: {
        type: Number,
        /**
         * 0 means pending
         * 1 means confirmed
         * -1 means rejected
        */
        default: 0,

    },
    cancel_delivery_reason: {
        type: String, trim: true
    },
    customer_cancel_order: {
        type: String, trim: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('orders', OrderSchema);