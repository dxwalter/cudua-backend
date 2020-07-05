
let CreateProductReview = require('../../Controllers/productReview/action/createProductReview')

module.exports = {
    Query: {

    },
    Mutation: {
        CreateProductReview (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            args = args.input;

            let createReview = new CreateProductReview();
            return createReview.createReview(args.productId, args.message, args.score, userId)
        }
    }
}