const CreateStudent = require('../../Controllers/course/students/createStudent');
const StudentActions = require('../../Controllers/course/students/studentActions');
const LoginStudent = require('../../Controllers/course/students/login');

module.exports = {
    Query: {
        LoginStudent(_, args) {
            let data = args.input
            let login = new LoginStudent();
            return login.loginStudent(data.email, data.password);
        },
        RecoverStudentPassword (_, args) {
            let data = args.input
            let recoverPassword = new StudentActions();
            return recoverPassword.recoverStudentPassword(data.email);
        }
    },
    Mutation: {
        CreateStudent (_, args) {
            let data = args.input
            let create = new CreateStudent();
            return create.CreateStudent(data.name, data.email, data.password, data.courseId, data.transactionReferenceId)
        },
        CreateNewStudentPassword (_, args) {
            let data = args.input
            let changePassword = new StudentActions();
            return changePassword.createNewPassword(data.email, data.password);
        },
        async EditStudentProfileImage (_, args, context) {

            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message
            args = args.input;

            const { filename, mimetype, createReadStream } = await args.file;

            let edit = new StudentActions();
            return edit.EditStudentLogo(args.file, userId)
        },
        async EditStudentProfileDetails (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message
            args = args.input;

            let editProfile = new StudentActions();
            return editProfile.EditProfileDetails(args.fullname, args.email, args.phoneNumber, args.instagramHandle, args.gender, userId )
        }
    }
}