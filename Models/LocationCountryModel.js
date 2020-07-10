const mongoose = require('mongoose');

const CountrySchema = mongoose.Schema({
    country_ms_id: {
        type: Number,
        required: true
    },
    name: {
        type: String, required: true, trim: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('location-countries', CountrySchema);