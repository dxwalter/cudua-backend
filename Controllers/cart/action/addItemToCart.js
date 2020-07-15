
const CartController = require('../CartController'); 
const BusinessController = require('../../business/BusinessController');
const ProductController = require('../../product/ProductController');
const UserController = require('../../user/UserController');
const CartModel = require('../../../Models/CartModel')

module.exports = class AddItemToCart extends CartController {
    constructor () {
        super();
        this.businessController = new BusinessController();
        this.productController = new ProductController();
        this.userController = new UserController();
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async addToCart(businessId, productId, color, size, userId) {

        if (businessId.length < 1) return this.returnMethod(200, false, `The business ID for this product was not provided`);

        if (productId.length < 1) return this.returnMethod(200, false, `The product ID for this product was not provided`);

        let getBusinessDetails = await this.businessController.getBusinessData(businessId);
        
        if (getBusinessDetails.error) return this.returnMethod(500, false, `An error occurred. Please try again`);

        if (getBusinessDetails.result._id != businessId) return this.returnMethod(500, false,  `This business has has either been moved or deleted`);

        // get user details
        let findUserData = await this.userController.findUsersById(userId);
        if (findUserData.error) return this.returnMethod(500, false,  `An error occurred from our end. Please try again`);
        
        if (findUserData.result == null || findUserData.result.business_details == userId) return this.returnMethod(200, false, `You cannot add your poduct to cart.`)

        // check if this item has been added to cart before

        let checkIfExists = await this.findItemInCart(businessId, productId);

        if (checkIfExists.error) return this.returnMethod(500, false, 'An error occurred. Please try again')

        if (checkIfExists.error == false && checkIfExists.result != null)  return this.returnMethod(200, false, `This product already exists in your cart. Visit your cart to view it`)

        let findProduct = await this.productController.FindProductById(productId);
        
        if (findProduct.error) return this.returnMethod(500, false, `An error occurred. Please try again`);
        if (findProduct.result._id != productId && findProduct.result._id != business_id) return this.returnMethod(500, false,  `This product is not recognised`);

        let createItem = new CartModel({
            owner: userId,
            product: productId,
            business: businessId,
            size: size.length > 1 ? size : null,
            color: color.length > 1 ? color : null
        });

        let create = await this.createCartItem(createItem);

        if (create.error) return this.returnMethod(500, false, `An error occurred adding ${findProduct.result.name} to your cart. Please try again`)

        return this.returnMethod(200, true, `${findProduct.result.name} was successfully added to your cart.`)
    }

}