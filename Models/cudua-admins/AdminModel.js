const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    fullname: {
        type: String, required: true, trim: true
    },
    email: {
        type: String, required: true, trim: true
    },
    password : {
        type : String, required : true
    },
    profilePicture: {
        type: String, 
        required: false,
        default: ""
    },
    created : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('administrators', AdminSchema);