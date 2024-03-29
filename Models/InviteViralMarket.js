const mongoose = require('mongoose');

const inviteViralMarketing = mongoose.Schema({
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    invite_id: {
        type: String,
        required: true
    },
    redeem_price: {
        type: Number,
        default: 0,
        // When this is 0, note that the business owner is yet to get the free monthly sub
        // 1 means the owner has gotten it
    },
    created : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('viral-ids', inviteViralMarketing);