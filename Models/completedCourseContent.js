const mongoose = require('mongoose');

const completedCourseContent = mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "enrolled-courses",
        required: true
    },
    created : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('completed-course-items', completedCourseContent);