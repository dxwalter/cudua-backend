const mongoose = require('mongoose');

const NewSubcategorySchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    subcategories: {
        type: String, required: true, trim: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('new-subcategories', NewSubcategorySchema);