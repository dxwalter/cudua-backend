"use-strict";

const ProductReviewController = require('../ProductReviewController');
const ProductController = require('../../product/ProductController');
const BusinessController = require('../../business/BusinessController');
const ProductReviewModel = require('../../../Models/productReview');
const CreateNotification = require('../../notifications/action/createNotification')

const OrderController = require('../../order/orderController')

module.exports = class CreateProductReview extends ProductReviewController {

    constructor () { 
        super();
        this.ProductController = new ProductController();
        this.BusinessController = new BusinessController();
        this.OrderController = new OrderController();
        this.CreateNotification = new CreateNotification()
    }

    returnData (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async updateReviewScore (productId) {
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
    }

    async createReview (productId, message, score, userId) {

        if (productId.length == false) return this.returnData(200, false,  `The ID for this product was not provided`);
        
        if (score < 1 || score > 5) return this.returnData(200, false, `Choose a review score between 1 to 5 for this product`)
        
        let getProductDetails = await this.ProductController.FindProductById(productId);
        if (getProductDetails.error == true) return this.returnData(500, false, `An error occurred. This product has been moved or deleted`)

        getProductDetails = getProductDetails.result
        let businessId = getProductDetails.business_id

        let getBusinessDetails = await this.BusinessController.getBusinessData(businessId);
        if (getBusinessDetails.error == true) return this.returnData(500, false, `An error occurred. This business has been moved or deleted`)
        
        // when a business owner tries to write a review for their own product
        getBusinessDetails = getBusinessDetails.result;
        if (userId == getBusinessDetails.owner._id) return this.returnData(200, false, "You cannot write a review for your own product")

        // check if this customer has ordered this product before
        let checkIfCustomerHasOrderedProduct = await this.OrderController.checkIfProductExistsInOrder(userId, productId);
        if (checkIfCustomerHasOrderedProduct.error) return this.returnData(500, false, `An error occurred while checking your review status`)

        if (checkIfCustomerHasOrderedProduct.result == null) return this.returnData(500, false, `You can't write a review for a product you have not ordered and used`);
        
        
        // check if user has reviewed product before
        // a user can only review a product once. If the user wants to review it again, the previous review will be updated
        let check = await this.CheckIfUserHasReviewedProduct(userId, productId);
        if (check.error == true) {
            return this.returnData(500, false, `An error occurred while checking your review status`)
        }

        if (check.result != null) {

            let reviewData = {
                rating: score,
                description: message
            }

            let updateReview = await this.findOneAndUpdate(check.result._id, reviewData)
            if (updateReview.error) return this.returnData(500, false, `An error occurred while updating your review`);
            
            this.updateReviewScore (productId)

            return this.returnData(200, true, `Your review was updated successfully`)

        }

        let createReview = new ProductReviewModel({
            author: userId,
            product_id: productId,
            rating: score,
            description: message
        });

        let oneSignalId = getBusinessDetails.owner.oneSignalId
        let businessEmailAddress = getBusinessDetails.owner.email

        let create = await this.InsertNewReview(createReview);

        if (create.error) return this.returnData(500, false, `An error occurred while saving your review`);

        this.updateReviewScore (productId)

        let notificationMessage = `A customer just wrote a review about your product. Click to learn more`;

        this.CreateNotification.createBusinessNotification(businessId, productId, "product_review", "New product review", notificationMessage)

        if (oneSignalId) {
            this.sendPushNotification(oneSignalId, `A customer just wrote a review about your product. Go to your shop manager to learn more`)
        }


        this.sendReviewEmail(businessEmailAddress, productId)

        return this.returnData(200, true, `Your review was submitted successfully`);


    }

    sendReviewEmail (emailAddress, productId) {

        let actionUrl = `https://cudua.com/b/product/${productId}`;

        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View product</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                A new product review
            </p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                A customer just wrote a review about your product. Click the link below to learn more 
            </p>
        
        </div>
        `
        let subject = `A new product review`;
        let textPart = "You can check it out";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");

    }

}