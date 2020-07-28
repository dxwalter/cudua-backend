
let AddItemToCart = require('../../Controllers/anonymousCart/action/anonymousAddItemToCart');
let GetItemsInCart = require('../../Controllers/anonymousCart/action/anonymousGetItemsInCart');


let tempResponse = () => {
    return {
        code: 200,
        success: false,
        message: "Your access token has either expired or not provided. This will supposed to work for anonymous users but I am yet to write that"
    }
}

module.exports = {
    Query: {
        AnonymousGetCartItems(_, args, context) {
            let getItems = new GetItemsInCart();
            return getItems.GetItemsByUserId(args.input.anonymousId);
        }
    },
    Mutation: {
        AnonymousAddItemToCart (parent, args, context) {
            args = args.input
            let addItem = new AddItemToCart();
            return addItem.AnonymousAddItemToCart(args.businessId, args.productId, args.colorId, args.sizeId, args.anonymousId)
        },
        AnonymousDeleteItemFromCart (parent, args, context) {
            args = args.input
            let deleteCart = new AddItemToCart();
            return deleteCart.AnonymousDeleteItemInCart(args.itemId, args.anonymousId);
        }
    }
}