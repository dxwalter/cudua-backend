
const CourseController = require('../courseManager/courseController');
const CourseCategoryModel = require('../../../Models/CourseCategoryModel');

module.exports = class studentCourseManager extends CourseController {
    constructor () {
        super()
    }

    returnAllCourses (courses, code, success, message) {
        return {
            courses, code, success, message
        }
    }

    async GetAllCoursesForUnsignedUser () {
        
            let getCourse = await this.studentGetPublishedCoursesAnonymous();

            if (getCourse.error == true) return this.returnAllCourses(null, 500, false, "An error occurred getting all the courses. Kindly try again.")

            if (getCourse.result.length == 0) return this.returnAllCourses(null, 500, false, "No course has been added yet. Kindly try again later.")

            let courseResultListing = getCourse.result;

            let coursesArray = [];

            courseResultListing.forEach(course => {
                coursesArray.push({
                    courseId: course._id,
                    publish: course.publish,
                    price: course.price,
                    name: course.name,
                    description: course.description,
                    displayPicture: course.displayPicture,
                    funnelPage: course.funnelPage,
                    enrolled: false
                })
            });

            return this.returnAllCourses(coursesArray, 200, true, "All courses retrieved successfully.")

    }

}