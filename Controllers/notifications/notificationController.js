'use-strict'

const FunctionRepo = require('../MainFunction');

const BusinessNotificationModel = require('../../Models/BusinessNotificationModel')
const CustomerNotificationModel = require('../../Models/CustomerNotificationModel')

module.exports = class NotificationController extends FunctionRepo {
    constructor () {
        super();
    }

    async createNotificationAlert(data) {
        try {

            let save = await data.save();

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
}