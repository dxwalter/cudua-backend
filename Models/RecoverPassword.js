const mongoose = require('mongoose');

const RecoverPassword = mongoose.Schema({
    userId: {
        type: String, required: true
    },
    secret : {
        type: String, required: true
    },
    created : {
        type : Date,
        default: Date.now
    }
    }, {timestamps: true} 
)

module.exports = mongoose.model('recoverpasswords', RecoverPassword);