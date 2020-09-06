const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String, required: true, trim: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
});