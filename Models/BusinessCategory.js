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

BusinessCategoriesSchema.virtual('categoryList', {
    ref: 'categories',
    localField: 'category_id',
    foreignField: '_id',
    justOne: false
});

BusinessCategoriesSchema.virtual('subcategoryList', {
    ref: 'subcategories',
    localField: 'subcategory.subcategory_id',
    foreignField: '_id',
    justOne: false
});

BusinessCategoriesSchema.set('toObject', { virtuals: true });
BusinessCategoriesSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('business-categories', BusinessCategoriesSchema);