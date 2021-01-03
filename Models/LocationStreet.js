const mongoose = require('mongoose');

const StreetSchema = mongoose.Schema({
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "location-countries",
        required: true
    },
    state_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "location-states",
        required: true
    },
    lga_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "location-lgas",
        required: true
    },
    community_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "location-communities",
        required: true
    },
    street_ms_id: {
        type: Number,
        required: false
    },
    name: {
        type: String, required: true, trim: true
    },
    status: {
        type: Number, required: true, default: 1
    },
    oldProximity: {
        type: String, trim: true
    },
    proximity: [{
        street: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "location-streets"
        }
    }],
    created : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('location-streets', StreetSchema);