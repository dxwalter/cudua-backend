const mongoose = require('mongoose');

const BusinessSchema = mongoose.Schema({
    businessname: {
        type: String, required: true
    },
    username: {
        type: String, required: false
    },
    address: {
        number: { type: String, default: ""},
        street: { type: String, default: ""},
        community: { type: String, default: ""},
        lga: { type: String, default: ""},
        state: {type: String, default: ""},
        country: {type: String, default: ""}
    },
    contact: {
        email: {type: String, default: ""},
        phone: {type: String, default: ""},
        whatsapp: {
            status: {type: Number, default: 0, required: false},
            number: {type: String, default: ""}
        }
    },
    logo: {type: String, default: ""},
    description: {type: String, default: ""},
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('business-accounts', BusinessSchema);