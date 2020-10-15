
const BusinessController = require('../BusinessController')
const CreateSubscription = require('../../subscription/action/createSubscription')

module.exports = class ViralRegistration extends BusinessController{

    constructor () {
        super();
        this.createSubscription = new CreateSubscription()
    }

    returnMethodForNewSubscription (subscriptionData, code, success, message) {
        return {
            subscriptionData: subscriptionData,
            code: code,
            success: success,
            message: message
        }
    }

    returnDownLineRecord (businessData, redeemPrice, code, success, message) {
        return {
            businessData: businessData,
            redeemPrice: redeemPrice,
            code: code,
            message: message,
            success: success
        }
    }

    returnViralStatus (status, code, success, message) {
        return {
            status: status,
            code: code,
            success: success,
            message: message
        }
    }

    returnIdMethod (viralId, code, success, message) {
        return {
            viralId: viralId,
            code: code,
            success: success,
            message: message
        }
    }
 
    async getBusinessViralId (businessId) {

        if (businessId.length < 1) return this.returnIdMethod(null, 500, false, "An error occurred. Kindly refresh the page and try again")

        let getId = await this.GetBusinessViralIdFromDb(businessId);

        if (getId.error) return this.returnIdMethod(null, 500, false, "An error occurred. Kindly refresh the page and try again")

        if (getId.result == null) {

            let newId = await this.generateId();

            // check if viral ID exists
            let checkIfIdExists = await this.getViralIdDetailsByViralId(newId);

            if (checkIfIdExists.error) this.returnIdMethod(null, 500, false, "An error occurred. Kindly refresh the page and try again")

            if (checkIfIdExists.result != null) this.getBusinessViralId(businessId)

            // store the viral ID
            let createNewViralId = await this.CreateNewViralId(newId, businessId);

            if (createNewViralId.error) return this.returnIdMethod(null, 500, false, "An error occurred. Kindly refresh the page and try again")

            return this.returnIdMethod(newId, 200, true, "Your referral ID was retrieved successfully");
        }

        return this.returnIdMethod(getId.result.invite_id, 200, true, "Your referral ID was retrieved successfully");

    }

    async getDownLiners(businessId) {

        if (businessId.length < 1) return this.returnDownLineRecord(null, 0, 200, false, "An error occurred. Kindly refresh this page and try again");

        let getViralIdDetailsUsingWithBusinessId = await this.GetViralDetailsWithBusinessId(businessId);

        if (getViralIdDetailsUsingWithBusinessId.error) return this.returnDownLineRecord(null, 0, 200, false, "An error occurred. Kindly refresh this page and try again");

        let redeemPrice = getViralIdDetailsUsingWithBusinessId.result == null ? 0 : getViralIdDetailsUsingWithBusinessId.result.redeem_price

        let downliners = await this.GetDownLiners(businessId);

        if(downliners.error) return this.returnDownLineRecord(null, 0, 200, false, "An error occurred. Kindly refresh this page and try again")

        if (downliners.result == 0) return this.returnDownLineRecord(null, 0, 200, false, "No business has registered using your invite link")

        let downLineData = [];

        for (let x of downliners.result) {
            if (x != null) {
                
                downLineData.push({
                    businessname: x.downliner.businessname,
                    logo: x.downliner.logo,
                    username: x.downliner.username,
                    id: x.downliner._id
                })
            }
        }

        return this.returnDownLineRecord(downLineData, redeemPrice,  200, true, "Registered business retrieved")

    }

    async getViralRedemptionStatus(businessId) {
        if (businessId.length < 1) return this.returnViralStatus(null, 200, false, "An error occurred. Refresh page and try again");

        let getViralId = await this.getBusinessViralId(businessId);

        if (getViralId.success == false) return this.returnViralStatus(null, 200, false, "An error occurred getting your viral registration ID. Refresh page and try again");

        let viralId = getViralId.viralId;

        let countDownLiners = await this.CountRegisteredDownliners(businessId)

        if (countDownLiners.error) return this.returnViralStatus(null, 200, false, "An error occurred getting your viral registration ID. Refresh page and try again");

        countDownLiners = countDownLiners.result;

        let getViralIdDetails = await this.getViralIdDetailsByViralId(viralId);

        if (getViralIdDetails.error) return this.returnViralStatus(null, 200, false, "An error occurred getting your viral registration ID. Refresh page and try again");

        let redemptionStatus = getViralIdDetails.result.redeem_price;

        if (redemptionStatus == 0 && countDownLiners >= 3) {
            return this.returnViralStatus(true, 200, true, "You can activate your subscription")
        } else {
            return this.returnViralStatus(false, 200, true, "You cannot activate your subscription")
        }

    }

    async activateViralRegistrationGift(businessId, viralId, userId) {
        
        if (businessId.length < 1) return this.returnMethodForNewSubscription(null, 200, false, "An error occurred. Kindly refresh page and try again");
        
        // get business invite id
        let getViralIdFromDB = await this.getViralIdDetailsByBusinessId(businessId)
        if (getViralIdFromDB.error || getViralIdFromDB.result == null) return this.returnMethodForNewSubscription(null, 200, false, "An error occurred. Kindly refresh page and try again");
        viralId = getViralIdFromDB.result.invite_id

        
        let createSubscription = await this.createSubscription.createNewSubscription(businessId, viralId, "Basic", 0, userId);

        if(createSubscription.success == false) return createSub

        let updateRecord = await this.updateViralData(viralId, {'redeem_price': 1});

        if (updateRecord.error) return this.returnMethodForNewSubscription(null, 500, false, "An error occurred updating your subscription status")

        return createSubscription
    }
} 