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
    subcategories: [{
        name: {
            type: String, required: false
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
    }],
    created : {
        type : Date,
        default: Date.now()
    }
});

CategorySchema.virtual('subcategoryList', {
    ref: 'subcategories',
    localField: '_id',
    foreignField: 'category_id',
    justOne: false,
    match: { status: 1 }
})

CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('categories', CategorySchema);