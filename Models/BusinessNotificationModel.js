const mongoose = require('mongoose');

const UserNotificationSchema = mongoose.Schema({
    owner: {
        // this is the account that the notification is sent to
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    action_id: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    is_read: {
        type: Number,
        required: true,
        default: 0
    },
    message: {
        type: String, trim: true, 
    },
    created : {
        type : Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('business-notifications', UserNotificationSchema);