"use-strict"

const FunctionRepo = require('../MainFunction');
const ProductReview = require('../../Models/productReview');


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
            const findScores = await ProductReview.find({product_id: productId}).select('rating');

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

    async CheckIfUserHasReviewedProduct(userId, productId) {

        try {
            
            let find = await ProductReview.findOne({
                $and: [
                    {
                        author: userId,
                        product_id: productId
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
                message: error.message
            }
        }
    }

    async getReviewByProductId(productId) {
        try {
            const getReviews = await ProductReview.find({product_id: productId})
            .populate('author', 'fullname profilePicture')
            .sort({_id: -1})
            .limit(15).exec();

            return {
                error: false,
                result: getReviews
            }
        } catch (error) {
            return {
                error: true, 
                message: error.message
            }
        }
    }

    async findOneAndUpdate(reviewId, newDataObject) {
        try {
            let updateRecord = await ProductReview.findOneAndUpdate({_id: reviewId}, { $set:newDataObject }, {new : true });
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

}