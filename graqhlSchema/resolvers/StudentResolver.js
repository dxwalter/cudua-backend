const CreateStudent = require('../../Controllers/course/students/createStudent');
const LoginStudent = require('../../Controllers/course/students/login');

module.exports = {
    Query: {
        LoginStudent(_, args) {
            let data = args.input
            let login = new LoginStudent();
            return login.loginStudent(data.email, data.password);
        }
    },
    Mutation: {
        CreateStudent (_, args) {
            let data = args.input
            let create = new CreateStudent();
            return create.CreateStudent(data.name, data.email, data.password, data.courseId, data.transactionReferenceId)
        }
    }
}