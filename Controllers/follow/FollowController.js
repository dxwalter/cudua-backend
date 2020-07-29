"use-strict"

const MainFunctions = require('../MainFunction');
const FollowModel = require('../../Models/FollowModel')


module.exports = class FollowContoller extends MainFunctions {
    constructor() { super() }

    async FollowBusiness(data) {

        try {
            let save = await data.save()
           
            return {
                result: save,
                error: false
            }
        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }

    }

    async CheckIfExist(businessId, userId) {
        try {

            let find = await FollowModel.findOne({
                $and: [{customer_id: userId, business_id: businessId}]
            })

            return {
                result: find,
                error: false
            }

        } catch(error) {
            
            return {
                message: error.message,
                error: true
            }

        }
    }

    async RemoveFollow(businessId, userId) {
        try {
            
            let deleteItem = await FollowModel.deleteOne({
                $and: [{customer_id: userId, business_id: businessId}]
            })

            if (deleteItem.ok == 1 && deleteItem.deletedCount == 1) {
                return {
                    result: true,
                    error: false
                }
            } else {
                return {
                    result: false,
                    error: false
                }
            }
           
        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }

    async GetBusinessUserIsFollowing(page, userId) {
        try {
            
            let limit = 12;

            let findFollowing = await FollowModel.find({customer_id: userId})
            .populate('business_id')
            .populate('categories')
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)

            return {
                error: false,
                result: findFollowing
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

}