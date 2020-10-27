"use-strict"

const SaveForLaterController = require('../SaveForLaterController');
const CreateCart = require('../../cart/action/addItemToCart');
const ProductController = require('../../product/ProductController');


module.exports = class SaveProductForLater extends SaveForLaterController {
    constructor () { 
        super()
        this.ProductController = new ProductController();
        this.CreateCart = new CreateCart();
    }

    returnMethod(code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    returnGetProductMethod (products,count, code, success, message) {
        return {
            products: products,
            count: count,
            code: code,
            success: success,
            message: message
        }
    }

    async SaveProduct (productId, businessId, userId) {
        
        if (productId.length < 1) return this.returnMethod(200, false, "The product's credential was not provided");

        if (businessId.length < 1) return this.returnMethod(200, false, "The business's credential was not provided");
        
        // check if product has already been added to save
        let check = await this.FindProductInSaveForLater(productId, userId);

        if (check.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again");

        if (check.result != null) return this.returnMethod(200, false, "This product already exists in your saved products")

        let save  = await this.InsertProduct(productId, userId, businessId);

        if (save.error) return this.returnMethod(500, false, "An error occurred saving this product for later");
        return this.returnMethod(200, true, "Product successfully saved");

    }

    async RemoveProduct (productId, userId) {
        if (productId.length < 1) return this.returnMethod(200, false, "The product's credential was not provided");

        let deleteProduct = await this.removeSavedProduct(productId, userId);

        if (deleteProduct.error) return this.returnMethod(500, false, "An error occurred while removing this product. Please try again");

        if (deleteProduct.result == false)  return this.returnMethod(200, false, "We could not remove this product. Please try again");

        if (deleteProduct.result) return this.returnMethod(200, true, "Product removed successfully");
    }

    async MoveToCart(productId, userId) {

        if (productId.length < 1) return this.returnMethod(200, false, "The product's credential was not provided");

        let productDetails = await this.ProductController.FindProductById(productId);

        if (productDetails.error) return this.returnMethod(500, false, "An error occurred while getting product details. Please try again");

        if (productDetails.result ==  null) return this.returnMethod(200, false, "This product has been moved or deleted.")

        let businessId = productDetails.result.business_id;

        let move = await this.CreateCart.addToCart(businessId, productId, "", "", userId);

        if (move.success == false) return this.returnMethod(move.code, move.success, move.message)
        if (move.success == true) {

            // remove from saved items
            this.RemoveProduct(productId, userId);
            return this.returnMethod(200, true, move.message)

        }

    }

    async GetSavedProducts(page, userId) {

        if (page < 1) page = 1

        let getProducts = await this.GetSavedProductsById(page, userId);

        if (getProducts.error) return this.returnGetProductMethod(null, 0, 500, false, 'An error occurred from our end. Please try again')

        if (getProducts.result.products == null && page > 1) return this.returnGetProductMethod(null, 0, 200, false, "Those are all the saved products.")

        if (getProducts.result.products == null || getProducts.result.totalNumberOfProducts < 1) return this.returnGetProductMethod(null, 0, 200, false, "You do not have a saved item.") 

        if (getProducts.result.totalNumberOfProducts > 0) {

            let count = getProducts.result.totalNumberOfProducts;

            let productArray = []

            for (const x of getProducts.result.products) {

                if (x.product_id != null){
                    productArray.push({
                        productId: x.product_id._id,
                        name: x.product_id.name,
                        image: x.product_id.primary_image,
                        review: x.product_id.score,
                        price: x.product_id.price,
                        businessId: x.business_id
                    })
                } else {
                    count = count - 1
                }
            }

            if (productArray.length == 0) return this.returnGetProductMethod(null, 0, 200, false, "You do not have a saved item.") 

            return this.returnGetProductMethod(productArray, count, 200, true, "Saved items successfully retrieved")
        }

    }
}