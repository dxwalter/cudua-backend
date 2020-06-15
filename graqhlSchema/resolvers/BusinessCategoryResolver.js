
const ChooseCategory = require('../../Controllers/businessCategory/action/createBusinessCategories');

module.exports = {
    Query: {

    },
    Mutation: {
        CreateBusinessCategory(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let createBusinessCategory = new ChooseCategory();
            return createBusinessCategory.ChooseCategory(args.input.businessId, args.input.categoryId, args.input.subcategories)
            
        }
    }
}