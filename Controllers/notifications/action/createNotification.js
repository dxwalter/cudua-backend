'use-strict'

const NotificationController = require('../notificationController');

const BusinessNotificationModel = require('../../../Models/BusinessNotificationModel')
const CustomerNotificationModel = require('../../../Models/CustomerNotificationModel');

module.exports = class createNotification extends NotificationController {
    constructor () {
        super();
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async createCustomerNotification (userId, actionId, notificationType, message) {
        if (userId.length < 1) return this.returnMethod(200, false, "Your account is not recognised. Sign out and sign in to continue.")

        if (message.length < 10) return this.returnMethod(200, false, "Please provide a descriptive message of your notification");

        // create
        let create = new CustomerNotificationModel({
            owner: userId,
            action_id: actionId,
            type: notificationType,
            message: message
        });

        let save = await this.createNotificationAlert(create);

        if (save.error == true) return this.returnMethod(500, false, "An error occurred from our end while saving customer's notification")

        return this.returnMethod(200, true, "Notification created successfully")
    }

    async createBusinessNotification (businessId, actionId, notificationType, message) {
        if (businessId.length < 1) return this.returnMethod(200, false, "Your business account is not recognised. Sign out and sign in to continue.")

        if (message.length < 10) return this.returnMethod(200, false, "Please provide a descriptive message of your notification");

        // create
        let create = new BusinessNotificationModel({
            owner: businessId,
            action_id: actionId,
            type: notificationType,
            message: message
        });

        let save = await this.createNotificationAlert(create);

        if (save.error == true) return this.returnMethod(500, false, "An error occurred from our end while saving customer's notification")

        return this.returnMethod(200, true, "Notification created successfully")
    }
}