"use-strict";

const BusinessController = require('../BusinessController');
const BusinessModel = require('../../../Models/BusinessModel');
const UserController = require('../../user/UserController');

const CreateSubscription = require('../../subscription/action/createSubscription');

const CreateNotification = require('../../notifications/action/createNotification')

module.exports = class CreateBusiness extends BusinessController {

    constructor(args) {
        super();
        this.name = args.name.toLowerCase();
        this.username = args.username.toLowerCase();
        this.inviteId = args.inviteId
        this.UserController = new UserController();
        this.CreateNotification = new CreateNotification()

        this.createSubscription = new CreateSubscription();
    }

    returnRequestStatus (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async saveViralRegistration(inviteId, businessId) {

        // get viral id details
        let viralIdDetails = await this.GetViralIdDetails(inviteId);
        
        console.log(viralIdDetails)

        if (viralIdDetails.error) return

        if (viralIdDetails.result == null) return

        let details = viralIdDetails.result;

        // count the number of documents that matches this inviteId

        let count = await this.countBusinessInvite(details.business_id);

        let uplinerId = details.business_id;

        if (count.error) return

        // if document count is less than 3
        if (count.result == 3) return

        // save and notify the business that initiated the invite
        let createDownLiner = await this.createNewDownliner(uplinerId, businessId);

        if (createDownLiner.error) return

        if (count.result == 2) {
            await this.CreateNotification.createBusinessNotification(uplinerId, inviteId, "Invite", "New Invite", `A new shop was created using your invitation link. You are qualified to get one month free basic plan.`);
            return
        }

        let text = ""

        if (count.result == 1) {
            text = "You have one more business to qualify for one month free basic plan"
        }

        if (count.result == 0) {
            text = "Invite two more businesses to qualify for one month free basic plan"
        }

        await this.CreateNotification.createBusinessNotification(uplinerId, inviteId, "Invite", "New Invite", `A new shop was created using your invitation link. ${text}`);
    }


    // order scripts are tied to this function. you should have written test but you chose not to
    async validateBusinessInput (userId) {
        

        let name = this.MakeFirstLetterUpperCase(this.name);
        let username = this.username;

        if (name.length <= 3) {
            return this.returnRequestStatus(200, false, "Your business name must be greater than 3 characters");
        }

        if (username.length <= 3) {
            return this.returnRequestStatus(200, false, "Your business username must be greater than 3 characters");
        }

        // regex username
        if (username == "cudua") {
            return this.returnRequestStatus(200, false, "Cudua is a reserved name. Enter a different username");
        }
        
        let checkUsername = new RegExp(/^(?!.*\.\.\s)(?!.*\.$)[^\W][\w.]{0,29}$/ig).test(username)

        if (checkUsername == false) {
            return this.returnRequestStatus(200, false, "Enter a valid username. Username must not contain any space or special character");
        }

        let usernameCheck = await this.checkUsernameExists(username);
        
        if (usernameCheck.error == true) {
            return this.returnRequestStatus(200, false, 'An error occurred checking if username exists');
        }

        if (usernameCheck.result > 0) {
            return this.returnRequestStatus(200, false, `The username ${username} exists. Try a different username`);
        }
      
        const createBusiness = new BusinessModel ({
            businessname : name,
            username : username,
            owner: userId,
            reviews: userId
        });

        let data = await this.createBusinessAccount(createBusiness);

        if (data.error == true) {
            return this.returnRequestStatus(500, false, data.message);
        }

        data = data.result

        let UserController = await this.UserController.findOneAndUpdate(userId, {business_details: data._id});

        if (UserController.error == true) {
            return this.returnRequestStatus(200, false, `An error occurred updating your personal account as a business owner. More details: ${UserController.message}`);
        }

        // create notification
        await this.CreateNotification.createBusinessNotification(data._id, data._id, "business_profile", "Online store created", "Congratulations! Your online store is up and running.");
        await this.CreateNotification.createBusinessNotification(data._id, data._id, "business_profile", "Update business profile", "Update your business profile to help customers find you.");
        
        // create one month basic subscription for free

        let createSub = await this.createSubscription.createNewSubscription(data._id, "free tier", "basic", 1);
        
        let subData = null;

        if (createSub.error) {
            await this.CreateNotification.createBusinessNotification(data._id, data._id, "Subscription", "Failed subscription", "An error occurred while activating your one month free basic subscription plan. Please our contact support team to get this issue fixed.");
        } else {
            // update
            let subscriptionData = createSub.result;

            let updateData = await this.findOneAndUpdate(data._id, {
                subscription: subscriptionData._id
            });

            if (updateData.error) {
                await this.CreateNotification.createBusinessNotification(data._id, subscriptionData._id, "Subscription", "Failed subscription", "An error occurred while activating your one month free basic subscription plan. Please our contact support team to get this issue fixed.");
            } else {
                await this.CreateNotification.createBusinessNotification(data._id, subscriptionData._id, "Subscription", "Successful subscription", "Your one month free basic subscription has been activated. Visit plans & billings tab in your account setting to learn more.");
            }

            subData = {
                subscriptionId: subscriptionData._id,
                subscriptionDate: subscriptionData.subscription_date,
                expiryDate: subscriptionData.expiry_date,
                subscriptionType: this.MakeFirstLetterUpperCase(subscriptionData.type),
            }

        }

        if (this.inviteId.length > 0){
            this.saveViralRegistration(this.inviteId, data._id)
        }
    
        
        return {
            businessDetails : {
                businessname: data.businessname,
                username: data.username,
                id: data._id,
                subscription: subData
            },
            code: 200,
            success: true,
            message: "Hurray! your business has been created successfully"
        }
    }

}