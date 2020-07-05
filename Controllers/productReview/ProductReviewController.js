"use-strict"

const FunctionRepo = require('../MainFunction');
const productReview = require('../../Models/productReview');


module.exports = class ProductReviewController extends FunctionRepo {
    constructor () {
        super();
    }

    async InsertNewReview (newReview) {
        
        try {
            const create = await newReview.save();
            return {
                error: false,
                result: create
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async GetReviewScore(productId) {
        try {
            const findScores = await productReview.find({product_id: productId}).select('rating');

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

    async getReviewByProductId(productId) {
        try {
            const getReviews = await productReview.find({product_id: productId})
            .populate('author', 'fullname profilePicture').exec();

            console.log(getReviews)

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