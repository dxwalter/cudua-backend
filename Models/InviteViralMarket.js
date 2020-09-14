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
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('viral-ids', inviteViralMarketing);