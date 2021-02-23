
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

    async checkIfStudentIsEnrolled (userId, courseId) {

        let check = await this.checkIfEnrolled(userId, courseId);
        if (check.error == true) return false
        if (check.result == null) return false
        return true

    }

    async courseEnrollmentCount (courseId) {
        let getCount = await this.getCourseEnrollmentCount(courseId)
        return getCount;
    }
 
    async GetAllCoursesForUnsignedUser () {
        
            let getCourse = await this.studentGetPublishedCoursesAnonymous();

            if (getCourse.error == true) return this.returnAllCourses(null, 500, false, "An error occurred getting all the courses. Kindly try again.")

            if (getCourse.result.length == 0) return this.returnAllCourses(null, 500, false, "No course has been added yet. Kindly try again later.")

            let courseResultListing = getCourse.result;

            let coursesArray = [];

        for (const course of courseResultListing) {

                let enrollCourseCount = await this.courseEnrollmentCount(course._id)

                coursesArray.push({
                    courseId: course._id,
                    publish: course.publish,
                    price: course.price,
                    name: course.name,
                    description: course.description,
                    displayPicture: course.displayPicture,
                    funnelPage: course.funnelPage,
                    enrolled: false,
                    reviewScore: course.reviewScore,
                    enrolledCount: enrollCourseCount
                })

            }

            return this.returnAllCourses(coursesArray, 200, true, "All courses retrieved successfully.")

    }

    async GetAllCoursesForSignedUser (userId) {

        let getCourse = await this.studentGetPublishedCoursesSigned();

        if (getCourse.error == true) return this.returnAllCourses(null, 500, false, "An error occurred getting all the courses. Kindly try again.")

        if (getCourse.result.length == 0) return this.returnAllCourses(null, 500, false, "No course has been added yet. Kindly try again later.")

        let courseResultListing = getCourse.result;

        let coursesArray = [];

        for (const course of courseResultListing) {

            let enrolled = await this.checkIfStudentIsEnrolled(userId, course._id)

            let enrollCourseCount = await this.courseEnrollmentCount(course._id)

            coursesArray.push({
                courseId: course._id,
                publish: course.publish,
                price: course.price,
                name: course.name,
                description: course.description,
                displayPicture: course.displayPicture,
                funnelPage: course.funnelPage,
                enrolled: enrolled,
                reviewScore: course.reviewScore,
                enrolledCount: enrollCourseCount
                
            })            
        }

        return this.returnAllCourses(coursesArray, 200, true, "All courses retrieved successfully.")
    }

    
    async StudentGetEnrolledCourses (userId) {
        
        if (userId.length == 0) {
            return this.returnAllCourses(null, 500, false, "We could not recognise your account. Log out and login again")
        }

        let getCourse = await this.getAllCoursesEnrolledByStudent(userId);


        if (getCourse.error == true) return this.returnAllCourses(null, 500, false, "An error occurred getting all the courses. Kindly try again.")

        if (getCourse.result.length == 0) return this.returnAllCourses(null, 500, false, "No course has been added yet. Kindly try again later.")

        let courseResultListing = getCourse.result;

        let coursesArray = [];

        for (const data of courseResultListing) {
            
            let course = data.courseId
            let enrollCourseCount = await this.courseEnrollmentCount(course._id)
            
            coursesArray.push({
                courseId: course._id,
                publish: course.publish,
                price: course.price,
                name: course.name,
                description: course.description,
                displayPicture: course.displayPicture,
                funnelPage: course.funnelPage == undefined ? "" : course.funnelPage,
                enrolled: true,
                reviewScore: course.reviewScore,
                enrolledCount: enrollCourseCount
            }); 

        }

        return this.returnAllCourses(coursesArray, 200, true, "All courses retrieved successfully.")

    }
}