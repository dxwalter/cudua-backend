const mongoose = require('mongoose');

const BusinessCategoriesSchema = mongoose.Schema({
    businessname: {
        type: String, required: true, trim: true
    },
    location: {
        type: String, required: true, trim: true
    },
    type: {
        type: String, required: true, trim: true
    },
    phone_one: {
        type: String, required: true, trim: true
    },
    phone_two: {
        type: String, required: false, trim: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('cudua-customers-contact', BusinessCategoriesSchema);