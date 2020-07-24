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

    async getNotificationForBusiness (businessId, page){
        try {

            let limit = 12;

            let getNotification = await BusinessNotificationModel.find({owner: businessId})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)

            return {
                result: getNotification,
                error: false
            }

        } catch (error) {

            return {
                error: true,
                message: error.message
            }

        }
    }

    async getNotificationForCustomer (userId, page){
        try {

            let limit = 12;

            let getNotification = await CustomerNotificationModel.find({owner: userId})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)

            return {
                result: getNotification,
                error: false
            }

        } catch (error) {

            return {
                error: true,
                message: error.message
            }

        }
    }

    async MarkAsRead (notificationId, dataObject, type) {

        try {

            let updateNotification;

            if (type == 'customer') {
                updateNotification = await CustomerNotificationModel.findOneAndUpdate({_id: notificationId}, {$set: dataObject});
            } else {
                updateNotification = await BusinessNotificationModel.findOneAndUpdate({_id: notificationId}, {$set: dataObject});
            }

            return {
                result: true,
                error: false,
            }


        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }
}