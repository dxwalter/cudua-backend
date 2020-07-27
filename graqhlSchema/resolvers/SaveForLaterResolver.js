"use-strict"
const SaveForLater = require('../../Controllers/saveForLater/action/saveProductForLater')

module.exports = {
    Query: {
        GetSavedItems(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let saveProduct = new SaveForLater();
            return saveProduct.GetSavedProducts(args.page, userId);
        }
    },
    Mutation: {
        SaveProductForLater (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let saveProduct = new SaveForLater();
            return saveProduct.SaveProduct(args.productId, userId)

        },
        RemoveProductFromSavedProducts (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let saveProduct = new SaveForLater();
            return saveProduct.RemoveProduct(args.productId, userId)
        },
        MoveToCart (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let saveProduct = new SaveForLater();
            return saveProduct.MoveToCart(args.productId, userId)
        }
    }
}