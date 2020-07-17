
let AddItemToCart = require('../../Controllers/cart/action/addItemToCart');
let GetItemsInCart = require('../../Controllers/cart/action/getItemsInCart');
let EditItemInCart = require('../../Controllers/cart/action/editItemInCart');

let tempResponse = () => {
    return {
        code: 200,
        success: false,
        message: "Your access token has either expired or not provided. This will supposed to work for anonymous users but I am yet to write that"
    }
}

module.exports = {
    Query: {
        GetCartItems(_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return tempResponse()
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
                return tempResponse()
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
                return tempResponse()
            } else {
                // known user
                userId = userId.message;
                args = args.input
                
                let deleteCart = new EditItemInCart();
                return deleteCart.deleteItemInCartSignIn(args.itemId, userId);
            }
        },
        UpdateItemQuantity(parent, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                // anonymous user
                return tempResponse()
            } else {
                // known user
                userId = userId.message;
                args = args.input
                
                let updateItemQuantity = new EditItemInCart();
                return updateItemQuantity.updateQuantity(args.itemId, args.quantity);
            }
        },
        UpdateItemColor(parent, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                // anonymous user
                return tempResponse()
            } else {
                // known user
                userId = userId.message;
                args = args.input
                
                let updateItemQuantity = new EditItemInCart();
                return updateItemQuantity.updateColor(args.itemId, args.colorId);
            }
        },
        UpdateItemSize(parent, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                // anonymous user
                return tempResponse()
            } else {
                // known user
                userId = userId.message;
                args = args.input
                
                let updateItemQuantity = new EditItemInCart();
                return updateItemQuantity.updateSize(args.itemId, args.sizeId);
            }
        }
    }
}