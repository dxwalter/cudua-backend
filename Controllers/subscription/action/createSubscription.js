'use-strict'

const subscriptionController = require('../subscriptionController')
const BusinessController = require('../../business/BusinessController');
const UserController = require('../../user/UserController')
const SubscriptionModel = require('../../../Models/SubscriptionModel');
const BusinessNotification = require('../../notifications/action/createNotification')

module.exports = class createSubScription extends subscriptionController {
    
    constructor () {
        super();
        this.businessController = new BusinessController();
        this.userController = new UserController();
        this.businessNotification = new BusinessNotification()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }


    returnMethodForNewSubscription (subscriptionData, code, success, message) {
        return {
            subscriptionData: subscriptionData,
            code: code,
            success: success,
            message: message
        }
    }


    expiredSubscriptionMessage () {
        return `
        <p style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
        Your basic subscription plan has expired. To this effect, Your shop and products will not appear in search results and suggestions. Follow the instructions below to resubscibe
        
        </p>

        <h3 style="display: block;margin: 0;padding: 0;color: #444444;font-family: Helvetica;font-size: 22px;font-style: normal;font-weight: bold;line-height: 150%;letter-spacing: normal;text-align: left;margin-bottom: 16px">
        How do subcribe.</h3>
                        
        <p style="margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
        
        <span style="color: #757575;font-family: Helvetica;font-size: 16px; margin-right: 8px">1.</span>

        <a href="https://cudua.com/auth/" target="_blank">Sign into</a> your account on cudua
        </p>

        <p style="margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
        
        <span style="color: #757575;font-family: Helvetica;font-size: 16px; margin-right: 8px">2.</span>

        Go to <a href="https://cudua.com/b/profile/edit?billing=true" target="_blank">account settings</a> in shop manager
        </p>

        <p style="margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
        
        <span style="color: #757575;font-family: Helvetica;font-size: 16px; margin-right: 8px">3.</span>

        Under <a href="https://cudua.com/b/profile/edit?billing=true" target="_blank">plans & billing tab</a>, you will see "All plans". Choose a plan that you want and click the subscribe button
        </p>
        `
    }

    renewedSubscriptionMessage () {
        return `
        <p style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
        Your basic subscription plan has been renewed. To this effect, Your shop and products will now appear in search results and suggestions. 
        
        </p>
        `
    }

    async createNewSubscription (businessId, referenceId, type = "basic", newBusiness = 0, userId = "") {

        // free subscription
        if (newBusiness == 1) {

            let create = new SubscriptionModel({
                business_id: businessId,
                type: type,
                transaction_ref: referenceId,
            });

            let createNew = await this.saveSubscription(create);
            

            if (createNew == false) {
                return {
                    error: true,
                    message: createNew.message
                }
            } else {
                return {
                    result: createNew.result,
                    error: false
                }
            }

        }

            
        let getBusinessDetails = await this.businessController.getBusinessData(businessId);

        if (getBusinessDetails.error) return this.returnMethodForNewSubscription(null, 200, false, "An error occurred. Refresh the page and try again")

        let oneSignalId = getBusinessDetails.result.owner.oneSignalId


        if (businessId && referenceId) {

            let start = Date.now();
            let end = +new Date() + 30*24*60*60*1000

            let updateSubscriptionData = {
                subscription_date: start,
                expiry_date: end,
                transaction_ref: referenceId
            }

            let updateTime = await this.findOneAndUpdate(businessId, updateSubscriptionData);

            if (updateTime.error) return this.returnMethodForNewSubscription(null, 500, false, "An error occurred updating your subscription record. Please contact the support team");

            start = updateTime.result.subscription_date;
            end = updateTime.result.expiry_date

            let updateBusinessSubscription = await this.businessController.findOneAndUpdate(businessId, {subscription_status: 0});

            if (updateBusinessSubscription.error) return this.returnMethodForNewSubscription(null, 500, false, "An error occurred updating your subscription record. Please contact the support team");

            // createsubscription reference
            let createSubRef = await this.createSubscriptionReference(businessId, referenceId)

            let getUserData = await this.userController.findUsersById(userId);

            if (!getUserData.error) {
                
                // send email
                let message = this.renewedSubscriptionMessage();
                let subject = "Renewed subscription";
                let textPart = "Your subscription has been renewed";
    
                let emailAction = `<a class="mcnButton" href="https://www.cudua.com/b/profile/edit?billing=true" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Visit business profile</a>`;
    
                let messageBody = this.emailMessageUi(subject, emailAction, message)
    
                let recipientEmail = getUserData.result.email
    
                await this.sendMail("Cudua@cudua.com", subject, recipientEmail, messageBody, textPart, "Cudua");
            }
    
            await this.businessNotification.createBusinessNotification(businessId,referenceId, "Subscription", "Subscription Activated", `Your subscription has been activated. Your shop and products will now appear in search results.`);


            if (oneSignalId.length > 0 || oneSignalId != null || oneSignalId != undefined) {
                this.sendPushNotification(oneSignalId, "Your subscription has been activated. Your shop and products will now appear in search results.")
            }
    
    
            return this.returnMethodForNewSubscription({start, end}, 200, true, "Subscription activated")


        } else {
            return this.returnMethodForNewSubscription(null, 200, false, "An error occurred. Your transaction ID was not provided")
        }

    }

    async deactivateSubscription (businessId, userId) {

        if (businessId.length < 1 ) return this.returnMethod(200, false, "An error occurred. Refresh the page and try again")

        let getBusinessDetails = await this.businessController.getBusinessData(businessId);

        if (getBusinessDetails.error) return this.returnMethod(200, false, "An error occurred. Refresh the page and try again");

        if (getBusinessDetails.result.subscription_status == 1) return this.returnMethod(200, true, "Subscription deactivated")

        // check if subscription is up for deactivation;
        // get the last transaction_ref
        let getTransactionRef = await this.getLastSubscriptionRef(businessId);

        if (getTransactionRef.error) return this.returnMethod(200, false, "An error occurred. Refresh the page and try again");

        let lastReferenceId = getTransactionRef.result.ref_id;

        if (lastReferenceId.length > 0) {

            // get subscription time
            let lastSubscription = await this.getLastSubscription(businessId)
            
            if (lastSubscription.error) return this.returnMethod(200, false, "An error occurred. Refresh the page and try again");

            let lastSubscriptionData = lastSubscription.result;

            if (lastSubscriptionData.transaction_ref == lastReferenceId) {
                
                let endTime = Date.parse(lastSubscriptionData.expiry_date);
                let now = Date.now();

                if (now < endTime) {
                    let newDataupdate = {subscription_status: 0};

                    let newUpdateRecord = await this.businessController.findOneAndUpdate(businessId, newDataupdate)
                    
                    return this.returnMethod(200, true, "Subscription activated")
                }
            }

        }

        // update business record and set subscription status to 1 which means expired
        let updateData = {subscription_status: 1};

        let updateRecord = await this.businessController.findOneAndUpdate(businessId, updateData);

        if (updateRecord.error) return this.returnMethod(500, false, "An error occurred. Refresh the page and try again")

        let getUserData = await this.userController.findUsersById(userId);

        if (!getUserData.error) {
                
            // send email
            let message = this.expiredSubscriptionMessage();
            let subject = "Expired subscription";
            let textPart = "Your subscription has expired";

            let emailAction = `<a class="mcnButton" href="https://www.cudua.com/b/profile/edit?billing=true" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Subscribe now</a>`;

            let messageBody = this.emailMessageUi(subject, emailAction, message)

            let recipientName = getUserData.result.fullname;
            let recipientEmail = getUserData.result.email

            await this.sendMail("Cudua@cudua.com", subject, recipientEmail, messageBody, textPart, "Cudua");
        }

        await this.businessNotification.createBusinessNotification(businessId, businessId, "Subscription", "Expired subscription", `Your subscription has expired. Your shop and products will no longer appear in search results. Visit plans & billing in your account settings to subscribe.`);

        let oneSignalId = getBusinessDetails.result.owner.oneSignalId

        if (oneSignalId.length > 0 || oneSignalId != null || oneSignalId != undefined) {
            this.sendPushNotification(oneSignalId, "Your subscription has expired. Your shop and products will no longer appear in search results. Visit plans & billing in your account settings to subscribe. Go to your shop manager to learn more.")
        }

        return this.returnMethod(200, true, "Subscription deactivated")

    } 

    async checkSubscriptionForbusiness (businessId) {
        let getLastSubscription = await this.getLastSubscription(businessId);

        // console.log(getLastSubscription)
    }

}