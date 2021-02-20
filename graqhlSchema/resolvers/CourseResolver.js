
const CourseCategory = require('../../Controllers/course/courseManager/courseCategory');
const CourseManager = require('../../Controllers/course/courseManager/course');

const { GraphQLUpload } = require('apollo-upload-server');

module.exports = {
    Upload: GraphQLUpload,
    Query: {
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
            // let accessToken = context.accessToken;

            // let userId = context.authFunction(accessToken);
            // if (userId.error == true) return userId
            // userId = userId.message;

            let input = args.input
            
            let getCourseContent = new CourseManager();
            return getCourseContent.GetCourseVideoContent(input.contentId)
        }
    },
    Mutation: {
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
            return create.createNewCourseContent(input.courseId, input.title, input.videoLink, input.avatar, input.courseMaterial)
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
    }
}