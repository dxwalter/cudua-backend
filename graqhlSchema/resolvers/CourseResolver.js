
const CourseCategory = require('../../Controllers/course/courseManager/courseCategory');   
const CourseManager = require('../../Controllers/course/courseManager/course');
const StudentCourseManager = require('../../Controllers/course/students/studentCourseManager')

const { GraphQLUpload } = require('apollo-upload-server');

module.exports = {
    Upload: GraphQLUpload,
    Query: {
        GetCourseReviews () {
            let getReview = new CourseManager;
            return getReview.GetAllReviews()
        },
        GetAllCourseCategories (_, args, context) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;
            
            let getCourse = new CourseCategory();
            return getCourse.getAllCourseCategories()
        },
        GetCourseContent (_, args, context) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let getCourseContent = new CourseManager();
            return getCourseContent.getCourseContentById(input.courseId)
        },
        GetAllCourses (_, args, context) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;
            
            let getCourseContent = new CourseManager();
            return getCourseContent.GetAllCourseListing()
        },
        GetContentVideo (_, args, context) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input
            
            let getCourseContent = new CourseManager();
            return getCourseContent.GetCourseVideoContent(input.contentId)
        },
        studentGetAllCourses (_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);

            let studentCourseManage = new StudentCourseManager();

            if (userId.error == true) {
                return studentCourseManage.GetAllCoursesForUnsignedUser();
            } else {
                userId = userId.message;
                return studentCourseManage.GetAllCoursesForSignedUser(userId);
            }
        },
        StudentGetEnrolledCourses (_, args, context) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let getEnrolledCourses = new StudentCourseManager();
            return getEnrolledCourses.StudentGetEnrolledCourses(userId)

        },
        StudentGetCourseContent (_, args, context) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let getCourseContent = new CourseManager();
            return getCourseContent.studentGetCourseContentById(userId, input.courseId)
        },
        StudentGetCourseVideo (_, args, context) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let getCourseContent = new CourseManager();
            return getCourseContent.studentGetCourseVideo(userId, input.courseId, input.contentId)
        }
    },
    Mutation: {
        async StudentMarkContentAsComplete (_, args, context) {

            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input;

            let getCourseContent = new CourseManager();
            return getCourseContent.MarkContentAsComplete(userId, input.courseId, input.contentId)
        },
        async CreateCourseCategory (_, args, context) {

            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input;

            const { filename, mimetype, createReadStream } = await input.image;

            let createCourse = new CourseCategory();
            return createCourse.createNewCourseCategory(input.name, input.image, input.about)
        },
        async CreateNewCourse (_, args, context) {

            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let create = new CourseManager();
            return create.createNewCourse(input.name, input.price, input.category, input.avatar, input.description)
        },
        CreateCourseContent (_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let create = new CourseManager();
            return create.createNewCourseContent(input.courseId, input.title, input.videoLink, input.avatar, input.courseMaterial, input.tutorialDescription)
        },
        PublishCourse (_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let publish = new CourseManager();
            return publish.changeCoursePublishState(input.courseId, input.state)

        },
        EditCourseDetails (_, args, context) {

            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let create = new CourseManager();
            return create.editCourseDetails(input.courseId, input.name, input.price, input.category, input.avatar, input.description, input.funnelPage)
        },
        EditCourseContent (_, args, context) {

            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let create = new CourseManager();
            return create.editCourseContent(input.courseId, input.title, input.videoLink, input.avatar, input.courseMaterial, input.contentId)
        },
        StudentEnrollCourse (_, args, context) {

            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let enrollStudent = new CourseManager();
            return enrollStudent.enrollInCourse(userId, input.courseId, input.transactionRef)
        },
        StudentMarkCourseAsComplete (_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let markCourseAsComplete = new CourseManager();
            return markCourseAsComplete.MarkCourseAsComplete(userId, input.courseId);
        },
        CreateCourseReview (_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let input = args.input

            let createReview = new CourseManager();
            return createReview.CreateCourseReview(input.courseId, userId, input.reviewScore, input.description);
        }
    }
}