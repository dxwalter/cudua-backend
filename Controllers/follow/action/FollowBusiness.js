"use-strict"

const FollowController = require('../FollowController');
const FollowModel = require('../../../Models/FollowModel');
const BusinessNotification = require('../../notifications/action/createNotification')

module.exports = class FollowBusiness extends FollowController {
    constructor() { 
        super()
        this.BusinessNotification = new BusinessNotification()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async createFollow(businessId, userId) {
       
        if (businessId.length < 1) return this.returnMethod(200, false, "An error occurred. Choose a business you want to follow")

        // check if customer has followed business before
        let checkIfExist = await this.CheckIfExist(businessId, userId);

        if (checkIfExist.error) return this.returnMethod(500, false, 'An error occurred from our end. Please try again');

        if (checkIfExist.result != null) return this.returnMethod(200, false, 'You already follow this business');

        let followBusiness  = new FollowModel({
            customer_id: userId,
            business_id: businessId
        });

        let save = await this.FollowBusiness(followBusiness);

        if (save.error) return this.returnMethod(500, false, 'An error occurred from our end. Please try again');

        let saveId = save.result._id;

        this.BusinessNotification.createBusinessNotification(businessId, saveId, "Follow", "New follower", "A customer followed your business");

        return this.returnMethod(200, true, "You successfully followed this business")
        
    }

    async deleteFollow(businessId, userId) {
        
        if (businessId.length < 1) return this.returnMethod(200, false, "An error occurred. Choose a business you want to follow");

        let unfollow = await this.RemoveFollow(businessId, userId);
        if (unfollow.error == true || unfollow.result == false) return this.returnMethod(200, false, `An error occurred unfollowing this business`);
        
        return this.returnMethod(200, true, `You successfully unfollowed this business.`);
    }
}