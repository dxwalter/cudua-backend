const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullname: {
        type: String, required: true, trim: true
    },
    email: {
        type: String, required: true, trim: true
    },
    phone : {
        type: String, required : false, default: ""
    },
    password : {
        type : String, required : true
    },
    profilePicture: {
        type: String, 
        required: false,
        default: ""
    },
    email_notification: {
        type: Number, 
        required: false, 
        default: 1
    },
    business_details : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business-accounts",
        required: false
    },
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer-review",
        required: false
    },
    review_score: {
        type: Number,
        default: 0
    },
    oneSignalId: {
        type: String,
        default: "",
        required: false
    },
    address: {
        number: { type: Number},
        bus_stop: {type: String, trim: true},
        street: { type: mongoose.Schema.Types.ObjectId, ref: "location-streets"},
        community: { type: mongoose.Schema.Types.ObjectId, ref: "location-communities"},
        lga: { type: mongoose.Schema.Types.ObjectId, ref: "location-lgas"},
        state: {  type: mongoose.Schema.Types.ObjectId, ref: "location-states"},
        country: { type: mongoose.Schema.Types.ObjectId, ref: "location-countries"},
    },
    created : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('users', UserSchema);