const mongoose = require('mongoose');

const BusinessSchema = mongoose.Schema({
    businessname: {
        type: String, required: true, trim: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    username: {
        type: String, required: false, trim: true
    },
    address: {
        bus_stop: {type: String, trim: true},
        number: { type: Number},
        street: { type: mongoose.Schema.Types.ObjectId, ref: "location-streets"},
        community: { type: mongoose.Schema.Types.ObjectId, ref: "location-communities"},
        lga: { type: mongoose.Schema.Types.ObjectId, ref: "location-lgas"},
        state: {  type: mongoose.Schema.Types.ObjectId, ref: "location-states"},
        country: { type: mongoose.Schema.Types.ObjectId, ref: "location-countries"},
    },
    contact: {
        email: {type: String, trim: true},
        phone: [{type: String}],
        whatsapp: {
            // 1 means activated
            status: {type: Number, default: 1},
            number: {type: String}
        }
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    paystackPublicKey: {
        type: String, required: false, default: ""
    },
    logo: {type: String, default: ""},
    coverPhoto: {type: String, default: ""},
    description: {type: String, default: ""},
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-review",
        required: true
    },
    review_score: {
        type: Number,
        required: true,
        default: 0
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscriptions"
    },
    subscription_status: {
        // this is the expiration status of a subscription
        // 0 = active
        // 1 = expired
        type: Number,
        default: 0
    },
    created : {
        type : Date,
        default: Date.now
    }
});

BusinessSchema.virtual('businessCategoryList', {
    ref: 'business-categories',
    localField: '_id',
    foreignField: 'business_id',
    justOne: false
})

BusinessSchema.set('toObject', { virtuals: true });
BusinessSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('business-accounts', BusinessSchema);