const CreateUser = require('../../Controllers/user/action/CreateUser');
const LoginUser = require('../../Controllers/user/action/LoginUser');
const RecoverPassword = require('../../Controllers/user/action/RecoverPassword');

module.exports = {
    Query: {
        getUser (parent, args, context, info) {

        },
        getUsers (parent, args, context, info) {

        },
        userLogin (parent, args, context, info) {
            let UserLogin = new LoginUser(args.input);
            return UserLogin.AuthenticateUser();
        }
    },
    Mutation: {
        createUser(parent, args, context, info) {
            let createUser = new CreateUser(args.input)
            return createUser.validateUserInput();   
        },
        recoverPassword (parent, args, context, info) {
            let recoverPassword = new RecoverPassword();
            return recoverPassword.recoverPasswordCheck(args)
        },
        resetPassword(parent, args, context, info) {
            let recoverPassword = new RecoverPassword();
            return recoverPassword.createNewPassword(args.input)
        }
    }
}