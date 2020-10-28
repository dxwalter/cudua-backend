
const NotificationController = require('../notificationController');

module.exports = class MarkAsRead extends NotificationController {

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

    async MarkNotificationAsRead (notificationId, type) {
        
        let mark = await this.MarkAsRead(notificationId, {is_read: 1}, type);

        if (mark.error) return this.returnMethod(500, false, "An error occurred while marking your notification as read")

        if (mark.result) return this.returnMethod(202, true, "Notification successfully marked as read")

    }

}