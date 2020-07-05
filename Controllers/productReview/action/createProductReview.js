"use-strict";

let ProductReviewController = require('../ProductReviewController');
let ProductController = require('../../product/ProductController');
let BusinessController = require('../../business/BusinessController');
let ProductReviewModel = require('../../../Models/productReview')

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

        let createReview = new ProductReviewModel({
            author: userId,
            product_id: productId,
            rating: score,
            description: message
        });

        let create = await this.InsertNewReview(createReview);

        await this.InsertNewReview(createReview);

        if (create.error) return this.returnData(500, false, `An error occurred while saving your review`);

        let getAllReviews = await this.GetReviewScore(productId);
        
        if (getAllReviews.error) return this.returnData(200, true, `Your review was submitted successfully`)

        let reviewCount = getAllReviews.result.length;
        let addedScores = 0;

        for (let reviewScore of getAllReviews.result) {
            addedScores = addedScores + parseInt(reviewScore.rating, 10);
        }

        let productReviewScore = addedScores / reviewCount;

        // update in product
        await this.ProductController.findOneAndUpdate(productId, {'score': productReviewScore.toFixed(1)})

        return this.returnData(200, true, `Your review was submitted successfully`)

    }

}