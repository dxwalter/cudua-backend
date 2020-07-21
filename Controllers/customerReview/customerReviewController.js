"use-strict"

const FunctionRepository = require('../MainFunction');
const CustomerReviewModel = require('../../Models/CustomerReview');

module.exports = class CustomerReviewController extends FunctionRepository {

    constructor () {
        super();
    }

    async createCustomerReview(data) {
        try {
            let save = await data.save();
            return {
                error: false,
                result: save
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async checkIfCustomerReviewExists(businessId, customerId) {
        try {

            let find = await CustomerReviewModel.findOne({
                $and: [
                    {
                        business_id: businessId,
                        customer_id: customerId
                    }
                ]
            });

            return {
                error: false,
                result: find
            }

        } catch (error) {
            return {
                error: true,
                result: find
            }
        }
    }

    async findOneAndUpdate(reviewId, newDataObject) {
        try {
            let updateRecord = await CustomerReviewModel.findOneAndUpdate({_id: reviewId}, { $set:newDataObject }, {new : true });
            return {
                error: false,
                result: updateRecord
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async GetReviewScore(customerId) {
        try {
            const findScores = await CustomerReviewModel.find({customer_id: customerId}).select('rating');

            return {
                error: false,
                result: findScores
            }

        } catch (error) {
            return {
                error: true, 
                message: error.message
            }
        }
    }
    
}