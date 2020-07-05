const ProductModel = require('../../../Models/Product');
const ProductController = require('../ProductController');
const ProductReviewController = require('../../productReview/ProductReviewController')


module.exports = class EditProduct extends ProductController {

    constructor () {
        super();
        this.ProductReviewController = new ProductReviewController();
    }

    returnData (product, code, success, message) {
        return {
            product: product,
            code: code,
            success: success,
            message: message
        }
    }


    async getProductById (productId) {

        if (productId.length < 1) return this.returnData(null, 200, false, `An error occurred. The ID of the product was not provided`)

        let getProduct = await this.GetProductById(productId);

        if (getProduct.error) return this.returnData(null, 500, false, `An error occurred. This product has been moved or deleted`)

        let productDetails = getProduct.result
        let getProductReview = await this.ProductReviewController.getReviewByProductId(productId)
    }

}