"use-strict"

const GetBusinessAccountingObject = require('../../Controllers/accounting/action/getAccount')
const GetAdminAccountingObject = require('../../Controllers/accounting/action/adminAccount')

module.exports = {

    Query: {
        GetBusinessAccounting(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input
            
            let getData = new GetBusinessAccountingObject();
            return getData.getBusinessAccount(args.businessId)
        },
        GetAdminAccounting(_, args, context) {
            
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            let getData = new GetAdminAccountingObject();
            return getData.getAdminAccountData()
        }
    },
    Mutation: {}
}