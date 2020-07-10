const mongoose = require('mongoose');

const StateSchema = mongoose.Schema({
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "location-countries",
        required: true
    },
    state_ms_id: {
        type: Number,
        required: true
    },
    name: {
        type: String, required: true, trim: true
    },
    status: {
        type: Number, required: true, default: 0
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('location-states', StateSchema);