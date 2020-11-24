const mongoose = require('mongoose');

const AdminNotificationSchema = mongoose.Schema({
    action_id: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    header: {
        type: String,
        required: true,
        trim: true
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


module.exports = mongoose.model('admin-notifications', AdminNotificationSchema);