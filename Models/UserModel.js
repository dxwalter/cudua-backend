const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullname: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    phone : {
        type: String, required : false
    },
    password : {
        type : String, required : true
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