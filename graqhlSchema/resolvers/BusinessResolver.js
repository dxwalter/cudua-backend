

const CreateBusiness = require('../../Controllers/business/action/createBusiness');

module.exports = {
    Query: {
        GetSingleBusinessDetails (parent, args, context, info) {
            console.log(args)
        }
    },
    Mutation: {
        CreateBusinessAccount(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let createBusinessObject = new CreateBusiness(args.createInput);
            return createBusinessObject.validateBusinessInput(userId);
        }
    }
}