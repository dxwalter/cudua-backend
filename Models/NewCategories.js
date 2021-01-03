const mongoose = require('mongoose');

const NewCategorySchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String, required: true, trim: true
    },
    subcategories: {
        type: String, required: true
    },
    created : {
        type : Date,
        default: Date.now
    }
});


module.exports = mongoose.model('new-categories', NewCategorySchema);