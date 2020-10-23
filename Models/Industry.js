const mongoose = require('mongoose');

const IndustrySchema = mongoose.Schema({
    name: {
        type: String, required: true, trim: true
    },
    ms_id: {
        type: Number
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('industries', IndustrySchema);