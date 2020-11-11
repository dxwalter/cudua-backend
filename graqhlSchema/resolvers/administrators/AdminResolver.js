"use-striv"

const CreateAdmin = require('../../../AdminControllers/user/action/createAdmin')
const LoginAdmin = require('../../../AdminControllers/user/action/login')

module.exports = {

    Query: {
        AdminGetBusinessAccounting(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input
            
            let getData = new GetBusinessAccounting();
            return getData.getBusinessAccount(args.businessId)
        },
        LoginAdmin(_, args, context) {
            args = args.input
            
            let login = new LoginAdmin();
            return login.LoginUser(args.email, args.password)
        }
    },
    Mutation: {
        CreateAdmin(_, args, context) {
            args = args.input
            
            let create = new CreateAdmin();
            return create.validateAdminData(args.fullname, args.email, args.password)
        }
    }
}