const mongoose = require('mongoose');

const SubscriptionSchema = mongoose.Schema({
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    type: {
        default: "basic",
        required: true,
        type: String
    },
    transaction_ref: {
        type: String,
        required: true
    },
    subscription_date : {
        type : Date,
        default: Date.now()
    },
    expiry_date: {
        type : Date,
        default: +new Date() + 30*24*60*60*1000
    },
    created : {
        type : Date,
        default: Date.now()
    },
    status: {
        // this is the expiration status of a subscription
        // 0 = active
        // 1 = expired
        type: Number,
        default: 0
    }

})

module.exports = mongoose.model('subscriptions', SubscriptionSchema);