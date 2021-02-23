const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    funnelPage: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    displayPicture: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course-category",
        required: true
    },
    publish: {
        type: Boolean,
        default: false
    },
    reviewScore: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    created : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('courses', CourseSchema);