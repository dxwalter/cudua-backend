'use-strict'

const FunctionRepository = require('../../MainFunction');
const CourseCategoryModel = require('../../../Models/CourseCategoryModel');
const CourseModel = require('../../../Models/courseModel');
const EnrolledCourseModel = require('../../../Models/EnrolledCourseModel');
const CourseContentModel = require('../../../Models/courseContentModel');
const CompletedCourseContent = require('../../../Models/completedCourseContent');


module.exports = class courseController extends FunctionRepository {

    constructor () {
        super();
    }

    async getCompletedContent(userId, courseId, contentId) {
        try {
                let getCompleted = await CompletedCourseContent.findOne({
                    $and: [
                        {
                            studentId: userId, 
                            courseId: courseId,
                            contentId: contentId
                        }
                    ]
                })
                .populate('courses')
                .populate('enrolled-courses')
                .populate('students');

                return {
                    error: false,
                    result: getCompleted
                }

        } catch (error) {
                return {
                    error: true,
                    message: error.message
                }
        }
    }

    async getCourseEnrollmentCount (courseId) {
        try {
            let countResult = await EnrolledCourseModel.countDocuments({courseId: courseId});
            return countResult
        } catch (error) {
            return 0;
        }
    }

    async getAllCoursesEnrolledByStudent (userId) {

        try {
            
            let find = await EnrolledCourseModel.find({studentId: userId})
            .populate('courseId')
            .sort({_id: -1});

            return {
                result: find,
                error: false
            }

        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }

    async checkIfEnrolled (userId, courseId) {
        try {
            
            let find = await EnrolledCourseModel.findOne({$and: [
                    {
                        studentId: userId,
                        courseId: courseId
                    }
                ]
            });

            return {
                result: find,
                error: false
            }

        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }

    async saveEnrollmentIntoCourse(data) {
        try {
            
            let create = await data.save()

            return {
                error: false,
                result: true
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async checkIfCourseExists (courseId) {
        try {
            
            const findResult = await CourseModel.findOne({_id: courseId});

            return {
                error: false,
                result: findResult
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
    
    async createNewCategoryForCourse (data) {

        try {
            
            let create = await data.save()

            return {
                error: false,
                result: true
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async findOneAndUpdate(courseId, newDataObject) {
        try {
            let updateRecord = await CourseModel.findOneAndUpdate({_id: courseId}, { $set:newDataObject }, {new : true });
            return {
                error: false,
                result: updateRecord
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async findOneAndUpdateContent(contentId, newDataObject) {
        try {
            let updateRecord = await courseContentModel.findOneAndUpdate({_id: contentId}, { $set:newDataObject }, {new : true });
            return {
                error: false,
                result: updateRecord
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async insertNewCourseContent (data) {

        try {
            
            let create = await data.save()

            return {
                error: false,
                result: true
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async insertNewCourse (data) {

        try {
            
            let create = await data.save()

            return {
                error: false,
                result: true
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async retrieveCourseContent(contentId) {
        try {
            
            let getContent = await CourseContentModel.findOne({
                _id: contentId
            })

            return {
                error: false,
                result: getContent
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async getCourseContentUsingId(courseId) {
        try {
            
            let getContent = await CourseContentModel.find({
                courseId: courseId
            })

            return {
                error: false,
                result: getContent
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async GetContentVideo(contentId) {
        try {
            
            let getContent = await CourseContentModel.findOne({
                _id: contentId
            })

            return {
                error: false,
                result: getContent
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async GetAllCourses() {
        try {
            
            let getCourses = await CourseModel.find().populate('category').sort({_id: -1});

            return {
                error: false,
                result: getCourses
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async GetCourseById(courseId) {
        try {
            
            let getCourses = await CourseModel.findOne({_id: courseId}).populate('category')

            return {
                error: false,
                result: getCourses
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async getAllCourseCategory () {

        try {
            
            let getAll = await CourseCategoryModel.find().sort({_id: -1});

            return {
                error: false,
                result: getAll
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async studentGetPublishedCoursesAnonymous () {
        try {
            let getCourses = await CourseModel.find({$and: [
                    {
                        publish: true,
                        price: {
                            $gt: 0
                        }
                    }
                ]
            })

            .sort({_id: -1})

            return {
                error: false,
                result: getCourses
            }
            
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async studentGetPublishedCoursesSigned () {
        try {

            let getCourses = await CourseModel.find({publish: true})
            .sort({_id: -1})

            return {
                error: false,
                result: getCourses
            }
            
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

}