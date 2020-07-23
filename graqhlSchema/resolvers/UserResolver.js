const CreateUser = require('../../Controllers/user/action/CreateUser');
const LoginUser = require('../../Controllers/user/action/LoginUser');
const RecoverPassword = require('../../Controllers/user/action/RecoverPassword');
const EditUserProfile = require('../../Controllers/user/action/EditUserProfile');

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
        },
        editUserContact(parent, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message
            args = args.input;

            let edit = new EditUserProfile();
            return edit.editUserContact(args.email, args.phone, userId)
        },
        editCustomerAddress(parent, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message
            args = args.input;

            let edit = new EditUserProfile();
            return edit.editCustomerAddress(args.streetNumber, args.streetId, args.busStop, userId)
        }
    }
}