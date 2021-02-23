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
        }
    }
}