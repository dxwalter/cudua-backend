'use-strict'

const BusinessModel = require('../../Models/BusinessModel');
const BusinessReviews = require('../../Models/BusinessReviews');
const FunctionRepo = require('../MainFunction');

module.exports = class BusinessController extends FunctionRepo {

    constructor () {
        super();
    }

    async checkUsernameExists (username) {
        try {
            const findResult = await BusinessModel.countDocuments({username: username});   
                return {
                    error: false,
                    result: findResult   
                }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async checkIfEmailExists(email) {
        try {
            const findResult = await BusinessModel.findOne({
                'contact.email': email
            });   

            return {
                error: false,
                result: findResult   
            }
    
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async createBusinessAccount (data) {
        
        try {
            const create = await data.save();
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

    async getBusinessData (businessId) {

        try {
            const findResult = await BusinessModel.findOne({
                _id: businessId
            })            
            .populate('address.street')
            .populate('address.community')
            .populate('address.lga')
            .populate('address.state')
            .populate('address.country')   
            .exec()

            if (findResult._id) {
                return {
                    error: false,
                    result: findResult   
                }
            }

            return {
                error: false,
                result: false   
            }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
    
    async findOneAndUpdate(businessId, newDataObject) {
        try {
            let updateRecord = await BusinessModel.findOneAndUpdate({_id: businessId}, { $set:newDataObject }, {new : true });
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

    async saveBusinessPhoneNumber(businessId, phoneNumber) {
        try {
            const findResult = await BusinessModel.findOne({
                _id: businessId
            }).exec();   

            findResult.contact.phone = []
            
            for(let number of phoneNumber) {
                findResult.contact.phone.push(number);
            }

            let saveData = await findResult.save();
            return {
                error: false,
                result: saveData
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async CreateBusinessReview (data) {
        let newReview = new BusinessReviews(data);

        try {
            let save = await newReview.save();

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

    async GetOneReviewByCustomer (customer, business) {
        try {
            
            let query = await BusinessReviews.findOne({
                $and: [
                    {
                        author: customer, 
                        business_id: business
                    }
                ]
            }, '_id');

            return {
                result: query,
                error: false
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async FindAndUpdateReview(reviewId, newDataObject) {
        try {
            let updateRecord = await BusinessReviews.findOneAndUpdate({_id: reviewId}, { $set:newDataObject }, {new : true });
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

    async GetReviewScore(businessId) {
        try {
            const findScores = await BusinessReviews.find({business_id: businessId}).select('rating');

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