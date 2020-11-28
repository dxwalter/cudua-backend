'use-strict'

const NotificationController = require('../notificationController');

const BusinessNotificationModel = require('../../../Models/BusinessNotificationModel')
const CustomerNotificationModel = require('../../../Models/CustomerNotificationModel');
const AdminNotificationModel = require('../../../Models/cudua-admins/AdminNotificationModel');

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

    async CreateAdminNotification (actionId, notificationType, header, message) {

        if (message.length < 10) return this.returnMethod(200, false, "Please provide a descriptive message of your notification");

        // create
        let create = new AdminNotificationModel({
            action_id: actionId,
            type: notificationType,
            header: header,
            message: message
        });

        let save = await this.createNotificationAlert(create);

        if (save.error == true) return this.returnMethod(500, false, "An error occurred from our end while saving customer's notification")

        return this.returnMethod(200, true, "Notification created successfully")
    }

    async createCustomerNotification (userId, actionId, notificationType, header, message) {
        if (userId.length < 1) return this.returnMethod(200, false, "Your account is not recognised. Sign out and sign in to continue.")

        if (message.length < 10) return this.returnMethod(200, false, "Please provide a descriptive message of your notification");

        // create
        let create = new CustomerNotificationModel({
            owner: userId,
            action_id: actionId,
            type: notificationType,
            header: header,
            message: message
        });

        let save = await this.createNotificationAlert(create);

        if (save.error == true) return this.returnMethod(500, false, "An error occurred from our end while saving customer's notification")

        return this.returnMethod(200, true, "Notification created successfully")
    }

    async createBusinessNotification (businessId, actionId, notificationType, header, message) {
        if (businessId.length < 1) return this.returnMethod(200, false, "Your business account is not recognised. Sign out and sign in to continue.")

        if (message.length < 10) return this.returnMethod(200, false, "Please provide a descriptive message of your notification");

        // create
        let create = new BusinessNotificationModel({
            owner: businessId,
            action_id: actionId,
            type: notificationType,
            message: message,
            header: header
        });

        let save = await this.createNotificationAlert(create);

        if (save.error == true) return this.returnMethod(500, false, "An error occurred from our end while saving customer's notification")

        return this.returnMethod(200, true, "Notification created successfully")
    }
}