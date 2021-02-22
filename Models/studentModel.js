const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    fullname: {
        type: String, required: true, trim: true
    },
    email: {
        type: String, required: true, trim: true
    },
    phone : {
        type: String, required : false, default: ""
    },
    password : {
        type : String, required : true
    },
    profilePicture: {
        type: String, 
        required: false,
        default: ""
    },
    gender: {
        type: String, 
        required: false
    },
    instagramId: {
        type: String, 
        required: false
    },
    oneSignalId: {
        type: String,
        default: "",
        required: false
    },
    created : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('students', StudentSchema);