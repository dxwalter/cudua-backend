"use-strict"

const CustomerReviewController = require('../customerReviewController');
const BusinessController = require('../../business/BusinessController');
const CustomerReviewModel = require('../../../Models/CustomerReview')

const CustomerNotification = require('../../notifications/action/createNotification');
let CustomerController = require('../../user/UserController')

module.exports = class CreateCustomerReview extends CustomerReviewController {

    constructor () {
        super();
        this.businessController = new BusinessController();
        this.customerNotification = new CustomerNotification();
        this.CustomerController = new CustomerController();
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }
 
    async updateReviewScore (customerId) {
        let getAllReviews = await this.GetReviewScore(customerId);
        
        if (getAllReviews.error) return this.returnMethod(200, true, "Your review was submitted successfully.")

        let reviewCount = getAllReviews.result.length;
        let addedScores = 0;

        for (let reviewScore of getAllReviews.result) {
            addedScores = addedScores + parseInt(reviewScore.rating, 10);
        }

        let productReviewScore = addedScores / reviewCount;

        // update in product
        await this.CustomerController.findOneAndUpdate(customerId, {'review_score': productReviewScore.toFixed(1)})
    }

    async createReview (businessId, customerId, rating, description, userId) {

        rating = rating < 1 ? 1 : rating;
     
        if (businessId.length < 1) return this.returnMethod(200, false, "Your business credential was not provided");
        if (customerId.length < 1) return this.returnMethod(200, false, "The customer's credential was not provided")

        let businessData = await this.businessController.getBusinessData(businessId);
        if (businessData.error == true) {
            return this.returnMethod(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        // check if this customer has beem reviewed by this business. If yes, update review else create new one

        let reviewCheck = await this.checkIfCustomerReviewExists(businessId, customerId);
        if (reviewCheck.error) return this.returnMethod(500, false, "An error occurred. Plese try again");

        if (reviewCheck.result != null) {
            // update

            let reviewId = reviewCheck.result._id;
            let newData = {
                rating: rating,
                description: description
            }

            let update = await this.findOneAndUpdate(reviewId, newData);
            if (update.error) return this.returnMethod(500, false, `An error occurred while updating your review`);

            this.updateReviewScore(customerId)
            return this.returnMethod(200, true, "Your review was submitted successfully.")
        }

        const create = new CustomerReviewModel({
            customer_id: customerId,
            business_id: businessId,
            rating: rating,
            description: description
        });

        let saveRecord = await this.createCustomerReview(create);

        if (saveRecord.error) return this.returnMethod(500, false, "An error occurred saving your review");
        
        let notificationId = saveRecord.result._id

        // create customer notification
        let createNotification = await this.customerNotification.createCustomerNotification(customerId, notificationId, "customerReview", `${businessData.result.businessname} wrote a review about you.`)
        
        this.updateReviewScore(customerId)
        
        return this.returnMethod(200, true, "Your review was submitted successfully.")
    }

}