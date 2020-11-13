"use-strict"

const MainFunctions = require('../MainFunction');
const EmailSubscribersModel = require('../../Models/EmailSubscribersModel')

module.exports = class EmailSubscriberController extends MainFunctions {
    constructor() { super() }

    async findSubscriptionEmail (emailAddress) {
        
        try {
            
            let findEmail = await EmailSubscribersModel.findOne({email: emailAddress});

            return {
                result: findEmail,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async saveSubscriber (data) {
        try {
            
            let saveData = await data.save();
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

}