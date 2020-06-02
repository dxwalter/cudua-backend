const mongoose = require('mongoose');

const BusinessSchema = mongoose.Schema({
    businessname: {
        type: String, required: true
    },
    username: {
        type: String, required: false
    },
    address: {
        number: { type: String, required: false },
        street: { type: String, required: false },
        community: { type: String, required: false },
        lga: { type: String, required: false},
        state: {type: String, required: false},
        country: {type: String, required: false}
    },
    contact: {
        email: {type: String, required: false},
        phone: [String],
        whatsapp: {
            status: {type: Number, default: 0, required: false},
            number: {type: String, required: false}
        }
    },
    logo: {type: String, require: false},
    description: {type: String, require: false},
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('business-accounts', BusinessSchema);