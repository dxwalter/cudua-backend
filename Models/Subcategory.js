const mongoose = require('mongoose');

const SubcategorySchema = mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    name: {
        type: String, required: true
    },
    status: {
        type: Number, default: 0
    },
    icon: {
        type: String, required: false
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('subcategories', SubcategorySchema);