"use-strict"

const CreateReview = require('../../Controllers/customerReview/action/createCustomerReview')

module.exports = {
    Query: {
        getCustomerReviews(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            let getReviews = new CreateReview();
            return getReviews.getAllReview(userId)
        }
    },
    Mutation: {
        createCustomerReview(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message
            args = args.input;

            let create = new CreateReview();
            return create.createReview(args.businessId, args.customerId, args.rating, args.description, userId)

        }
    }
}