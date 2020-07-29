const mongoose = require('mongoose');

const FollowSchema = mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: true
    },
    created : {
        type : Date,
        default: Date.now()
    }
});

FollowSchema.virtual('categories', {
    ref: 'business-categories', // The model to use
    localField: 'business_id', // Find people where `localField`
    foreignField: 'business_id', // is equal to `foreignField`
    justOne: false,
    options: { sort: { hide: 0 }} // Query options, see http://bit.ly/mongoose-query-options
  });

  
  FollowSchema.set('toObject', { virtuals: true });
  FollowSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Follow', FollowSchema);