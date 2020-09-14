
const BusinessController = require('../BusinessController')

module.exports = class ViralRegistration extends BusinessController{

    constructor () {
        super()
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

}