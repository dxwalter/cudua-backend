"use-strict";

let ProductReviewController = require('../ProductReviewController');
let ProductController = require('../../product/ProductController');
let BusinessController = require('../../business/BusinessController')

module.exports = class CreateProductReview extends ProductReviewController {

    constructor () { 
        super();
        this.ProductController = new ProductController();
        this.BusinessController = new BusinessController()
    }

    returnData (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async createReview (productId, message, score, userId) {

        if (productId.length == false) return this.returnData(200, false,  `The ID for this product was not provided`);
        if (message.length < 2) return this.returnData(200, false, `Type your feedback`)
        if (score < 1 || score > 5) return this.returnData(200, false, `Choose a review score between 1 to 5 for this product`)
        
        let getProductDetails = await this.ProductController.FindProductById(productId);
        if (getProductDetails.error == true) return this.returnData(500, false, `An error occurred. This product has been moved or deleted`)

        getProductDetails = getProductDetails.result

        let getBusinessDetails = await this.BusinessController.getBusinessData(getProductDetails.business_id);
        if (getBusinessDetails.error == true) return this.returnData(500, false, `An error occurred. This business has been moved or deleted`)
        
        getBusinessDetails = getBusinessDetails.result

        if (userId == getBusinessDetails.owner) return this.returnData(200, false, "You cannot write a review for your own product")

        

    }

}