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
    created : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('course-category', CourseCategory);