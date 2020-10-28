const mongoose = require('mongoose');

const AccountingModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    orderId: {
        type: String, required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    referenceId: {
        type: String, required: true
    },
    totalPrice: {
        type: Number, required: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('account-records', AccountingModel);