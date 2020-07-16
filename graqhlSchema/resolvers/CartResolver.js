
let AddItemToCart = require('../../Controllers/cart/action/addItemToCart');
let GetItemsInCart = require('../../Controllers/cart/action/getItemsInCart');


module.exports = {
    Query: {
        GetCartItems(_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                // anonymous user
            } else {
                // known user
                userId = userId.message;
                let getItems = new GetItemsInCart();
                return getItems.GetItemsByUserId(userId);
            }
        }
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
        },
        DeleteItemFromCart (parent, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                // anonymous user
            } else {
                // known user
                userId = userId.message;
                args = args.input
            }
        }
    }
}