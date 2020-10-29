const mongoose = require('mongoose');

const transactionRefId = mongoose.Schema({
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    ref_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: false,
        default: 0
    },
    created : {
        type : Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('subscription-ref-id', transactionRefId);