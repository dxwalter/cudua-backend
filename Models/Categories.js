const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String, required: true, trim: true
    },
    ms_id: {
        type: Number
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "industries",
        required: true
    },
    icon: {
        type: String, required: false, default: ""
    },
    status: {
        type: Number, default: 0
    },
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