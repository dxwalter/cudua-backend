"use-strict"

const CustomerReviewController = require('../customerReviewController');
const BusinessController = require('../../business/BusinessController');
const CustomerReviewModel = require('../../../Models/CustomerReview')

const CustomerNotification = require('../../notifications/action/createNotification');
const CustomerController = require('../../user/UserController')

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

    returnCustomerReviews(code, success, message, reviews, reviewScore = 0) {
        return {
            code: code,
            success: success,
            message: message,
            reviews: reviews,
            reviewScore: reviewScore
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
            if (businessData.result.owner._id != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getCustomerDetails = await this.CustomerController.findUsersById(customerId)
        
        if (getCustomerDetails.error) return this.returnMethod(500, false, "An error occurred. Kindly try again");

        let customerOnesignalId = getCustomerDetails.result.oneSignalId
        

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
        let createNotification = await this.customerNotification.createCustomerNotification(customerId, notificationId, "customerReview", "New review",`${businessData.result.businessname} wrote a review about you.`)

        if (customerOnesignalId) {
            this.sendPushNotification(customerOnesignalId, `${businessData.result.businessname} wrote a review about you. Go to your customer profile to read it.`)
        }
        
        this.updateReviewScore(customerId)
        
        return this.returnMethod(200, true, "Your review was submitted successfully.")
    }

    formatReviews (data) {

        let reviewArray = [];

        for (const x of data) {
            reviewArray.push({
                businessId: x.business_id._id,
                customerId: x.customer_id,
                rating: x.rating,
                description: x.description,
                logo: x.business_id.logo,
                timeStamp: x.created,
                author: x.business_id.businessname
            })
        }

        return reviewArray

    }

    async getAllReview(userId) {
        
        if (userId.length < 1) return this.returnCustomerReviews(200, false, "An error occurred. Sign into your account and try again", [], 0);

        let getCustomerDetails = await this.CustomerController.findUsersById(userId)
        
        if (getCustomerDetails.error) return this.returnCustomerReviews(500, false, "An error occurred. Kindly try again", [], 0);

        let reviewScore = getCustomerDetails.result.review_score

        let getReviews = await this.getCustomerReviews(userId);
        
        if (getReviews.error) return this.returnCustomerReviews(500, false, "An error occurred. Kindly try again", [], 0);
        
        
        let reviews = getReviews.result.length == 0 ? [] : this.formatReviews(getReviews.result);

        return this.returnCustomerReviews(200, true, "Reviews successfully retrieved", reviews, reviewScore)

    }
}