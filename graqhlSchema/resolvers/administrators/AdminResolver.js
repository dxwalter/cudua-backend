"use-striv"

const CreateAdmin = require('../../../AdminControllers/user/action/createAdmin')

module.exports = {

    Query: {
        GetBusinessAccounting(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input
            
            let getData = new GetBusinessAccounting();
            return getData.getBusinessAccount(args.businessId)
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