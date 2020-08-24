const mongoose = require('mongoose');

const NewLocationSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "location-countries",
        required: true,
        default: "5f41789d3affd42e5892fac2"
    },
    state: {
        type: String,
        required: true, trim: true
    },
    lga: {
        type: String,
        required: true, trim: true
    },
    community: {
        type: String, required: true, trim: true
    },
    street: {
        type: String, required: true, trim: true
    },
    proximity: {
        type: String, trim: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('new-locations', NewLocationSchema);