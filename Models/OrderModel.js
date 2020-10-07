const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
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
        type: String, trim: true, default: ""
    },
    delivery_time: {
        start: {
            type: String, trim: true, default: ""
        },
        end: {
            type: String, trim: true, default: ""
        }
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
    customer_cancel_order_reason: {
        type: String, trim: true, default: ""
    },
    customer_cancel_order: {
        type: Number, default: 0
    },
    created : {
        type : Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('orders', OrderSchema);