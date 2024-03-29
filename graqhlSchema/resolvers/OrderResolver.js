
const CreateOrder = require('../../Controllers/order/action/createOrder');
const DeleteItem = require('../../Controllers/order/action/deleteItemInOrder');
const GetOrders = require('../../Controllers/order/action/getOrder')
const OrderState = require('../../Controllers/order/action/orderState')

const { GraphQLDateTime } = require('graphql-iso-date') ;

module.exports = {
    DateTime: GraphQLDateTime,
    Query: {
        BusinessGetOrders(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let getOrder = new GetOrders();
            return getOrder.getOrderListingForBusiness(args.businessId, userId)
        },
        SearchForOrder (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let getOrder = new GetOrders();
            return getOrder.searchForOrder(args.businessId, args.orderId)
        },
        BusinessGetProductsInOrder(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let getOrder = new GetOrders();
            return getOrder.businessGetProductsInOrder(args.businessId, args.orderId, userId)
        },

        GetNewOrderCount(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let getOrder = new GetOrders();
            return getOrder.getOrderCount(args.businessId)
        },

        GetOrderItemsForCustomer(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let getOrder = new GetOrders();
            return getOrder.GetCustomerOrderDetails(args.orderId, userId)
        },
        GetCustomerOrderIds (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input
            let getOrder = new GetOrders();
            return getOrder.GetCustomerOrderListingIds(userId)
        }
    },
    Mutation: {
        CreateOrder (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            let createOrder = new CreateOrder();
            return createOrder.create(userId)
        },
        CustomerDeleteProductInOrder (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let deleteItemInOrder = new DeleteItem();
            return deleteItemInOrder.deleteItem(args.orderId, args.productId, userId)
        },
        ConfirmOrder(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let confirm = new OrderState();
            return confirm.confirmOrder(args.businessId, args.customerId, args.orderId, args.deliveryCharge, userId, args.startTime, args.endTime, args.paymentMethod)
        },
        RejectOrder(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let reject = new OrderState();
            return reject.businessRejectOrder(args.businessId, args.customerId, args.orderId, args.reason, userId)
        },
        CustomerCancelOrder(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let reject = new OrderState();
            return reject.customerCancelOrder(args.businessId, args.orderId, args.reason, userId)
        },
        UpdateDeliveryCharge(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let updateDelivery = new OrderState();
            return updateDelivery.updateDeliveryCharge(args.businessId, args.customerId, args.orderId, args.deliveryCharge, userId, args.startTime, args.endTime, args.paymentMethod);
        },
        RejectOrderDelivery(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let reject = new OrderState();
            return reject.RejectDelivery(args.businessId, args.orderId, userId)
        },
        ConfirmDelivery(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let confirm = new OrderState();
            return confirm.DecideConfirmationType(args.businessId, args.orderId, userId)
        },
        DeleteOrder(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let deleteOrder = new OrderState();
            return deleteOrder.deleteOrder(args.orderId, args.businessId, args.customerId)
        },
        ConfirmOnlinePayment(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let confirmOnlinePayment = new OrderState();
            return confirmOnlinePayment.ConfirmPayment(args.orderId, args.businessId, args.referenceId, userId, "Paid online")
        }
    }
}