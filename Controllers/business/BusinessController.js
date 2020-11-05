'use-strict'

const BusinessModel = require('../../Models/BusinessModel');
const BusinessReviews = require('../../Models/BusinessReviews');
const FunctionRepo = require('../MainFunction');

const ViralIdStoreModel = require('../../Models/InviteViralMarket')
const BusinessInvite = require('../../Models/inviteReferral')

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
            .populate('owner')
            .exec()

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

    async getBusinessDataByUsername (username) {

        try {
            const findResult = await BusinessModel.findOne({
                username: username
            })
            .populate('owner')            
            .populate('address.street')
            .populate('address.community')
            .populate('address.lga')
            .populate('address.state')
            .populate('address.country')   
            .exec()

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

    async GetReviewsForBusiness(businessId) {
        try {
            
            let reviews = await BusinessReviews.find({business_id: businessId})
            .populate('author', ['fullname', 'profilePicture', '_id'] )
            .populate('business_id', 'review_score')
            .sort({_id: -1})
            .limit(24);

            return {
                result: reviews,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async GetBusinessViralIdFromDb(businessId) {
        try {

            let getId = await ViralIdStoreModel.findOne({business_id: businessId});

            return {
                error: false,
                result: getId
            }
            
        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }

    async CreateNewViralId(newId, businessId) {
        
        let data = new ViralIdStoreModel({
            business_id: businessId,
            invite_id: newId
        })

        try {
            
            let save = await data.save()

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

    async GetViralIdDetails (inviteId) {

        try {
            
            let findResult = await ViralIdStoreModel.findOne({invite_id: inviteId});

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

    async GetViralDetailsWithBusinessId (businessId) {

        try {
            
            let findResult = await ViralIdStoreModel.findOne({business_id: businessId});

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

    async countBusinessInvite (businessId) {
        try {
            let countResult = await BusinessInvite.countDocuments({upliner : businessId});
            return {
                result: countResult,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            };
        }
    }

    async createNewDownliner(upliner, downliner) {

        let data = new BusinessInvite({
            downliner: downliner,
            upliner: upliner
        });

        try {
            
            let save = await data.save();

            return {
                error: false,
                result: save,
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async GetDownLiners(businessId) {

        try {

            let findData = await BusinessInvite.find({upliner: businessId})
            .populate('downliner')
            .sort({_id: -1})
            .limit(24);

            return {
                error: false,
                result: findData
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }

    }

    async updateViralData(inviteId, newData) {
        try {
            let updateRecord = await ViralIdStoreModel.findOneAndUpdate({invite_id: inviteId}, { $set:newData }, {new : true });
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

    async CountRegisteredDownliners(businessId) {
        try {
            let getCount = await BusinessInvite.countDocuments({upliner: businessId});
            return {
                error: false,
                result: getCount
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async getViralIdDetailsByViralId(InviteId) {
        try {
            
            let details = await ViralIdStoreModel.findOne({invite_id: InviteId});

            return {
                error: false,
                result: details
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async getViralIdDetailsByBusinessId(businessId) {
        try {
            
            let details = await ViralIdStoreModel.findOne({business_id: businessId});

            return {
                error: false,
                result: details
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async RegularBusinessSearch(keyword, page) {

        try {

            let limit = 50
            
            let getBusiness = await BusinessModel
            .find({
                $or: [
                    { businessname: { $regex: '.*' + keyword + '.*', $options: 'i'}},
                    { username: { $regex: '.*' + keyword + '.*', $options: 'i'}}
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('address.street')
            .populate('address.community')
            .populate('address.lga')
            .populate('address.state')
            .populate('address.country');
            
            return {
                result: getBusiness,
                error: false
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }
        }

    }

    async businessSearchCount (keyword) {
        try {
            let countResult = await BusinessModel.countDocuments({
                $or: [
                    { businessname: { $regex: '.*' + keyword + '.*', $options: 'i'}},
                    { username: { $regex: '.*' + keyword + '.*', $options: 'i'}}
                ]
            });
            return countResult
        } catch (error) {
            return 0;
        }
    }

    async homePageBusiness (page) {
        
        try {

            // total number of returned products per request
            let limit = 20;

            let getBusiness = await BusinessModel.find({
                subscription_status: 0
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)

            return {
                error: false,
                result: getBusiness
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }
    }

    async advancedBusinessSearch(communityId, page) {
        try {
            
            let limit  = 50

            let searchBusiness = await BusinessModel.find({
                $and: [
                    {
                        'address.community': communityId, 
                        subscription_status: 0
                    }
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)

            return {
                error: false,
                result: searchBusiness
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

}