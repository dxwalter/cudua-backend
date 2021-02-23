const mongoose = require('mongoose');

const CourseCategory = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    videoLink: {
        type: String,
        required: false
    },
    isComplete: {
        type: Boolean,
        required: false,
        default: false
    },
    materials: {
        type: String,
        required: true
    },
    keywords: {
        type: String,
        required: false,
        default: ""
    },
    displayPicture: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },
    created : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('course-contents', CourseCategory);