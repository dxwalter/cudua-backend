"use-strict"

const EmailSubscriberController = require('../emailSubscriberController')
const EmailSubscribersModel = require('../../../Models/EmailSubscribersModel')

module.exports = class CreateSubscriber extends EmailSubscriberController {
    
    constructor () { super(); }

    returnData (code, success, message) {
        return {
            code: code, 
            success: success,
            message: message
        }
    }

    async CreateSubscriber (emailAddress) {
        
        if (emailAddress.length < 5 || this.validateEmailAddress(emailAddress) == false) {
            return this.returnData(500, false, "Enter a valid email address")
        }

        // check if email exists
        let checkEmailExistence = await this.findSubscriptionEmail(emailAddress)
        if (checkEmailExistence.error) return this.returnData(500, false, "An error occurred from our end. Kindly try again")
        
        if (checkEmailExistence.result != null) return this.returnData(200, false, "You are a subscriber.")

        let save = new EmailSubscribersModel({
            email: emailAddress
        });

        let saveEmailToDb = await this.saveSubscriber(save);

        if (saveEmailToDb.error == false) return this.returnData(200, true, "Your subscription was successful")
        if (saveEmailToDb.error ==  true) return this.returnData(200, false, "Your subscription failed. Please try again")

    }
}