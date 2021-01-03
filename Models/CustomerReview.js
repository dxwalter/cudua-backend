const mongoose = require('mongoose');

const CustomerReview = mongoose.Schema({
    customer_id: {
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

module.exports = mongoose.model('customer-review', CustomerReview);