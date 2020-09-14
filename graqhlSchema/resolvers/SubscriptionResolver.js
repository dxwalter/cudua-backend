const SubscriptionActions = require('../../Controllers/subscription/action/createSubscription')

module.exports = {
    Query: {

    },
    Mutation: {
        disableSubscription (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input
            let sub = new SubscriptionActions();
            return sub.deactivateSubscription(args.businessId, userId)
        },
        createSubscription (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input
            let createSub = new SubscriptionActions();
            return createSub.createNewSubscription(args.businessId, args.referenceId, args.type)
        }
    }
}