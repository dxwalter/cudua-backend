const mongoose = require('mongoose');

const CommunitySchema = mongoose.Schema({
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
    community_ms_id: {
        type: Number,
        required: false
    },
    name: {
        type: String, required: true, trim: true
    },
    status: {
        type: Number, required: true, default: 1
    },
    created : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('location-communities', CommunitySchema);