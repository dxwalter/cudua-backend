const mongoose = require('mongoose');

const registeredDownliners = mongoose.Schema({
    downliner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    upliner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('registered-downliners', registeredDownliners);