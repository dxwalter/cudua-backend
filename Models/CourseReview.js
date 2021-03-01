const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },
    rating: {type: Number, required: true},
    description: {type: String, trim: true, required: false},
    created : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('course-reviews', CourseSchema);