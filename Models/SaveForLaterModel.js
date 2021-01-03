const mongoose = require('mongoose');

const SaveForLater = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    created : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('save-for-later', SaveForLater);