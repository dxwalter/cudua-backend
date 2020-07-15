
let AddItemToCart = require('../../Controllers/cart/action/addItemToCart');

module.exports = {
    Query: {

    },
    Mutation: {
        AddItemToCart (parent, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                // anonymous user
            } else {
                // known user
                userId = userId.message;
                args = args.input
                
                let addItem = new AddItemToCart();
                return addItem.addToCart(args.businessId, args.productId, args.colorId, args.sizeId, userId)
            }
        }
    }
}