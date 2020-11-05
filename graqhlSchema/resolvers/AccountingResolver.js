"use-striv"

const GetBusinessAccounting = require('../../Controllers/accounting/action/getAccount')

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
    Mutation: {}
}