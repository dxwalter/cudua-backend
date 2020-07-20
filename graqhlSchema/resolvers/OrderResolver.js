
const CreateOrder = require('../../Controllers/order/action/createOrder');
const DeleteItem = require('../../Controllers/order/action/deleteItemInOrder');
const GetOrders = require('../../Controllers/order/action/getOrder')

module.exports = {
    Query: {
        BusinessGetOrders(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }
            args = args.input

            let getOrder = new GetOrders();
            return getOrder.getOrderListingForBusiness(args.businessId, userId)
        }
    },
    Mutation: {
        CreateOrder (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let createOrder = new CreateOrder();
            return createOrder.create(userId)
        },
        CustomerDeleteProductInOrder (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            args = args.input

            let deleteItemInOrder = new DeleteItem();
            return deleteItemInOrder.deleteItem(args.orderId, args.productId, userId)
        }
    }
}