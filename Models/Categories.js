const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String, required: true
    },
    icon: {
        type: String, required: false
    },
    status: {
        type: Number, default: 0
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('categories', CategorySchema);