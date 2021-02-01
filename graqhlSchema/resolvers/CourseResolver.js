
const CourseCategory = require('../../Controllers/course/courseManager/courseCategory');

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
        }
    }
}