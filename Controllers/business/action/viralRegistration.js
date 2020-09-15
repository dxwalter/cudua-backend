
const BusinessController = require('../BusinessController')

module.exports = class ViralRegistration extends BusinessController{

    constructor () {
        super()
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

}