const mongoose = require('mongoose');

const EnrolledCourseSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true
    },
    transactionRefId: {
        type: String, required: true, trim: true
    },
    completedStatus: {
        type: Number, default: 0
    },
    created : {
        type : Date,
        default: Date.now
    }
});

module.exports = mongoose.model('enrolled-courses', EnrolledCourseSchema);