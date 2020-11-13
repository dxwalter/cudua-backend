const mongoose = require('mongoose');

const EmailSubscribers = mongoose.Schema({
    email: {
        type: String, required: true, trim: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('email-subscribers', EmailSubscribers);