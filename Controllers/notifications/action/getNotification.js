

const NotificationController = require('../notificationController');

const BusinessNotificationModel = require('../../../Models/BusinessNotificationModel')
const CustomerNotificationModel = require('../../../Models/CustomerNotificationModel');
const BusinessController = require('../../business/BusinessController');

module.exports = class GetNotification extends NotificationController {

    constructor () {
        super();
        this.businessController = new BusinessController();
    }

    returnMethod (notification, code, success, message) {
        return {
            notification: notification,
            code: code,
            success: success, 
            message: message
        }
    }

    returnCount (count, code, success, message) {
        return {
            count: count,
            code: code,
            success: success, 
            message: message
        }
    }

    formatNotification (data) {

        let notificationArray = [];

        for (const [index, notification] of data.entries()) {
            notificationArray[index] = {
                notificationId: notification._id,
                isRead: notification.is_read,
                owner: notification.owner,
                actionId: notification.action_id,
                header: notification.header == undefined ? "" : notification.header,
                type: notification.type,
                message: notification.message,
                timeStamp: notification.created
            }
        }

        return notificationArray

    }

    async getBusinessNotification (businessId, page, userId) {

        if (businessId.length < 1) return this.returnMethod(null, 200, false, "Your business credential was not provided.");

        // check if business exists
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnMethod(null, 200, false, "Your business is not recognised.");
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnMethod(null, 200, false, `You can not access this functionality. You do not own a business`);
            }
        }

        let get = await this.getNotificationForBusiness(businessId, page);

        if (get.error) return this.returnMethod(null, 500, false, "An error occurred getting your business notifications. Please try again");

        if (get.result.length < 1 && page < 2) return this.returnMethod(null, 200, true, "You do not have any a notification");
        if (get.result.length < 1 && page > 1) return this.returnMethod(null, 200, true, "That is all for now");

        let formatNotification = this.formatNotification(get.result);

        return this.returnMethod(formatNotification, 200, true, "Notification retrieved successfully");

    }

    async getCustomerNotification(page, userId) {
        let get = await this.getNotificationForCustomer(userId, page);

        if (get.error) return this.returnMethod(null, 500, false, "An error occurred getting your notifications. Please try again");

        if (get.result.length < 1 && page < 2) return this.returnMethod(null, 200, true, "You do not have any a notification");
        if (get.result.length < 1 && page > 1) return this.returnMethod(null, 200, true, "That is all for now");

        let formatNotification = this.formatNotification(get.result);

        return this.returnMethod(formatNotification, 200, true, "Notification retrieved successfully");
    }

    async getCustomerNotificationCount(userId) {
        let getCount = await this.getUnreadCustomerNotification(userId);
        if (getCount.error) return this.returnCount(0, 500, false, "An error occurred");
        return this.returnCount(getCount.result, 200, true, "Successful")
    }

    async getBusinessNotificationCount(businessId) {
        let getCount = await this.getUnreadBusinessNotification(businessId);
        if (getCount.error) return this.returnCount(0, 500, false, "An error occurred");
        return this.returnCount(getCount.result, 200, true, "Successful")
    }

}