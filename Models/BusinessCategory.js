const mongoose = require('mongoose');

const BusinessCategoriesSchema = mongoose.Schema({
    business_id: {
        type: String, required: true
    },
    category_id: {
        type: String, required: false
    },
    hide: {
        type: Number, required: false, default: 0
    },
    subcategory: [{
        subcategory_id: {
            type: String, required: false
        },
        hide: {
            type: Number, required: false, default: 0
        }
    }],
    created : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('business-categories', BusinessCategoriesSchema);