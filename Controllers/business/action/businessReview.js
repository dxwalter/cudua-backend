"use-strict";

let BusinessController = require('../BusinessController');
let UserController = require('../../user/UserController');
let OrderController = require('../../order/orderController');
const CreateNotification = require('../../notifications/action/createNotification')

module.exports = class CreatebusinessReview extends BusinessController {

    constructor () {
        super()
        this.CreateNotification = new CreateNotification();
        this.OrderController = new OrderController();
    }

    returnGetReviewMethod (reviews, score, code, success, message) {
        return {
            reviews: reviews,
            score: score,
            code: code,
            success: success,
            message: message
        }
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    formatBusinessReview (data) {

        let newDataArray = []

        let reviewScore = 0;

        for (const [index, x] of data.entries()) {
            if (index == 0) reviewScore = x.business_id.review_score
            newDataArray[index] = {
                author: {
                    fullname: x.author.fullname,
                    userId: x.author._id,
                    displayPicture: x.author.profilePicture == undefined || x.author.profilePicture == null ? "" : x.author.profilePicture
                },
                description: x.description,
                rating: x.rating,
                timeStamp: x.created
            }
        }

        return {
            score: reviewScore,
            reviews: newDataArray
        }

    }

    async updateReviewScore (businessId) {
        let getAllReviews = await this.GetReviewScore(businessId);
        
        if (getAllReviews.error) return this.returnMethod(200, true, "Your review was submitted successfully.")

        let reviewCount = getAllReviews.result.length;
        let addedScores = 0;

        for (let reviewScore of getAllReviews.result) {
            addedScores = addedScores + parseInt(reviewScore.rating, 10);
        }

        let businessReviewScore = addedScores / reviewCount;

        // update in product
        await this.findOneAndUpdate(businessId, {'review_score': businessReviewScore.toFixed(1)})
    }

    async CreateReview (userId, businessId, description, score) {
        
        // check if this business has a cleared order from this business

        let checkIfUserHasMadeOrder = await this.OrderController.CheckCustomerStatusWithBusiness(userId, businessId);

        if (checkIfUserHasMadeOrder.error) return this.returnMethod(500, false, `An error occurred from our end. Kindly try again`);
        // if custome has made an ordered from this, the orderID would be returned. If not returned, stop execution
        if (checkIfUserHasMadeOrder.result == null) return this.returnMethod(200, false, `For you to write a review of this business, you have to place an order`); 

        // check if this customer has written a review before
        let checkIfNewReview = await this.GetOneReviewByCustomer(userId, businessId);

        if (checkIfNewReview.error) return this.returnMethod(500, false, `An error occurred from our end. Kindly try again`);

        if (checkIfNewReview.result != null) {
            // update
            let reviewId = checkIfNewReview.result._id;
            let newData = {
                rating: score,
                description: description
            }

            let update = await this.FindAndUpdateReview(reviewId, newData);
            if (update.error) return this.returnMethod(500, false, `An error occurred while updating your review`);

            this.updateReviewScore(businessId)
            return this.returnMethod(200, true, "Your review was submitted successfully.")

        } else {
        
            let createObject = {
                author: userId,
                business_id: businessId,
                rating: score,
                description: description
            }

            let create = await this.CreateBusinessReview(createObject);

            if (create.error) return this.returnMethod(500, false, `An error occurred from our end. Kindly try again`);

            let createBusinessNotification = this.CreateNotification.createBusinessNotification(businessId, create.result._id, "businessReview", "Business review", "A new review has been written about your business.")
            this.updateReviewScore(businessId)
            return this.returnMethod(200, true, "Your review has been submitted")

        }

    }

    async GetBusinessReview(businessId) {
        if (businessId.length < 1) return this.returnGetReviewMethod(null, 0, 200, false, "An error occurred from our end. please try again")

        let getBusinessReviews = await this.GetReviewsForBusiness(businessId);
        
        if (getBusinessReviews.error) return this.returnGetReviewMethod(null, 0, 200, false, `An error occurred from our end. please try again. ${error.message}`);

        if (getBusinessReviews.result == null) return this.returnGetReviewMethod(null, 0, 200, true, "No review has been written for this business")

        let formatReview = this.formatBusinessReview(getBusinessReviews.result);

        return this.returnGetReviewMethod(formatReview.reviews, formatReview.score, 200, true, "Business reviews retrieved")
    }
    
}