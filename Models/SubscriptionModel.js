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
        // default: +new Date().getTime() + 5*60000
    },
    created : {
        type : Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('subscriptions', SubscriptionSchema);