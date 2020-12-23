
const GetNotification = require('../../Controllers/notifications/action/getNotification');
const MarkNotification = require('../../Controllers/notifications/action/markAsRead');

const { GraphQLDateTime } = require('graphql-iso-date') ;

module.exports = {
    DateTime: GraphQLDateTime,
    Query: {
        GetBusinessNotification (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let notification = new GetNotification();
            return notification.getBusinessNotification(args.businessId, args.page, userId)
        },
        GetBusinessNotificationCount(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let notification = new GetNotification();
            return notification.getBusinessNotificationCount(args.businessId, userId)
        },
        GetCustomerNotification (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let notification = new GetNotification();
            return notification.getCustomerNotification(args.page, userId)
        },
        GetCustomerNotificationCount(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let notification = new GetNotification();
            return notification.getCustomerNotificationCount(userId)
        },
        GetAdminNotificationCount (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let notification = new GetNotification();
            return notification.getAdminNotificationCount()
        },
        GetAdminNotification (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let notification = new GetNotification();
            return notification.getAdminNotification(args.page)
        }
    },
    Mutation: {
        MarkNotificationAsRead(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input
            let mark = new MarkNotification();
            return mark.MarkNotificationAsRead(args.notificationId, args.type);
        },
        MarkAdminNotificationAsRead(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input
            let mark = new MarkNotification();
            return mark.MarkAdminNotificationAsRead(args.notificationId, args.type);
        }
    }
}