const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullname: {
        type: String, required: true, trim: true
    },
    email: {
        type: String, required: true, trim: true
    },
    phone : {
        type: String, required : false
    },
    password : {
        type : String, required : true
    },
    profilePicture: {
        type: String, 
        required: false
    },
    email_notification: {
        type: Number, 
        required: false, 
        default: 1
    },
    business_details : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: false
    },
    created : {
        type : Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('users', UserSchema);