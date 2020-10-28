'use-strict'

const AnonymousCartController = require('../anonymousCartController'); 
const BusinessController = require('../../business/BusinessController');
const ProductController = require('../../product/ProductController');
const UserController = require('../../user/UserController');
const AnonymousCartModel = require('../../../Models/AnonymousCartModel');

const SignedCartController = require('../../cart/CartController')

module.exports = class AddItemToCart extends AnonymousCartController {
    constructor () {
        super();
        this.businessController = new BusinessController();
        this.productController = new ProductController();
        this.userController = new UserController();
        this.SignedCartController = new SignedCartController()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async AnonymousAddItemToCart(businessId, productId, color, size, userId) {

        if (businessId.length < 1) return this.returnMethod(200, false, `The business ID for this product was not provided`);

        if (productId.length < 1) return this.returnMethod(200, false, `The product ID for this product was not provided`);

        let getBusinessDetails = await this.businessController.getBusinessData(businessId);
        
        if (getBusinessDetails.error) return this.returnMethod(500, false, `An error occurred. Please try again`);

        if (getBusinessDetails.result._id.toString() != businessId) return this.returnMethod(500, false,  `This business has has either been moved or deleted`);

        
        // check if this item has been added to cart before
        let checkIfExists = await this.findItemInCart(businessId, productId, userId);

        if (checkIfExists.error) return this.returnMethod(500, false, 'An error occurred. Please try again')

        if (checkIfExists.error == false && checkIfExists.result != null)  return this.returnMethod(200, false, `This product already exists in your cart. Visit your cart to view it`)

        let findProduct = await this.productController.FindProductById(productId);
        
        if (findProduct.error) return this.returnMethod(500, false, `An error occurred. Please try again`);
        if (findProduct.result._id.toString() != productId && findProduct.result.business_id.toString() != business_id) return this.returnMethod(500, false,  `This product is not recognised`);

        let createItem = new AnonymousCartModel({
            owner: userId,
            product: productId,
            business: businessId,
            size: size.length > 1 ? size : "",
            color: color.length > 1 ? color : ""
        });

        let create = await this.createCartItem(createItem);

        if (create.error) return this.returnMethod(500, false, `An error occurred adding ${findProduct.result.name} to your cart. Please try again`)

        return this.returnMethod(200, true, `${findProduct.result.name} was successfully added to your cart.`)
    }

    async AnonymousDeleteItemInCart(itemId, userId) {
        
        if (userId.length < 1)  return this.returnMethod(401, false, `Invalid access token. Sign out and sign into your account again`);
        if (itemId.length < 1)  return this.returnMethod(500, false, `An error occurred from our end. Refresh and try again`);

        let deleteItem = await this.deleteItemInCartByUserIdAndItemId(userId, itemId) 

        if (deleteItem.error == true || deleteItem.result == false) return this.returnMethod(200, false, `An error occurred from our end while removing your item from cart.`);

        return this.returnMethod(200, true, `An item was deleted successfully from your cart.`);

    }

    async MoveAnonymousCartToOnymousCart(anonymousId, userId) {
        
        // note that the userId here is the user that has signed in.
        // we use the ID to move the cart items to signed-cart
        if (anonymousId.length < 1 || userId.length < 1) {
            return
        }  

        let getAllItemsInAnonymousCart = await this.findItemsByUserId(anonymousId);

        if (getAllItemsInAnonymousCart.error  || getAllItemsInAnonymousCart.result == null) {
            return
        }

        getAllItemsInAnonymousCart = getAllItemsInAnonymousCart.result

        let approvedItemArray = []

        for (let item of getAllItemsInAnonymousCart) {
            let productId = item.product._id;
            let businessId = item.business._id

            let findInSignedCart = await this.SignedCartController.findItemInCart(businessId, productId, userId)

            if (findInSignedCart.error == false && findInSignedCart.result == null) {
                approvedItemArray.push({
                    owner: userId,
                    product: productId,
                    business: businessId,
                    size: item.size.length > 0 ? item.size : "",
                    color: item.color.length > 0 ? item.color : "",
                    quantity: item.quantity
                })
            }
        }


        await this.SignedCartController.saveMultipleCart(approvedItemArray);
        await this.deleteAllFromAnonymousCart(anonymousId)

    }

}