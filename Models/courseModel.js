const mongoose = require('mongoose');

const CourseCategory = mongoose.Schema({
    name: {
        type: String,
        required: true
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

module.exports = mongoose.model('courses', CourseCategory);