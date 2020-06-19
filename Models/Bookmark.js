const mongoose = require('mongoose');

const BookmarkSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    bookmarks: [{
        business_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "business-accounts",
            required: true
        },
        added : {
            type : Date,
            default: Date.now()
        }
    }],
    created : {
        type : Date,
        default: Date.now()
    }
});

// get business details
// BookmarkSchema.virtual('BookmarkBusinessDetailsList', {
//     ref: 'business-accounts',
//     localField: 'bookmarks.business_id',
//     foreignField: 'business_id',
//     justOne: false
// });

// get business category list
// BookmarkSchema.virtual('BusinessCategoryList', {
//     ref: 'business-categories',
//     localField: 'bookmarks.business_id',
//     foreignField: 'business_id',
//     justOne: false
// });

// BookmarkSchema.virtual('businessCategoryList', {
//     ref: 'subcategories',
//     localField: 'subcategory.subcategory_id',
//     foreignField: '_id',
//     justOne: false
// });

BookmarkSchema.set('toObject', { virtuals: true });
BookmarkSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('bookmark', BookmarkSchema);