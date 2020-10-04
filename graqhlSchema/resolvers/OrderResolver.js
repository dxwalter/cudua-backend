
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

        
        BusinessGetProductsInOrder(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let getOrder = new GetOrders();
            return getOrder.businessGetProductsInOrder(args.businessId, args.customerId, args.orderId, userId)
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
            return confirm.confirmOrder(args.businessId, args.customerId, args.orderId, args.deliveryCharge, userId)
        },
        RejectOrder(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let reject = new OrderState();
            return reject.rejectOrder(args.businessId, args.customerId, args.orderId, args.reason, userId)
        },
        UpdateDeliveryCharge(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let updateDelivery = new OrderState();
            return updateDelivery.updateDeliveryCharge(args.businessId, args.customerId, args.orderId, args.deliveryCharge, userId);
        },
        RejectOrderDelivery(_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            args = args.input

            let reject = new OrderState();
            return reject.RejectDelivery(args.businessId, args.orderId, userId)
        }
    }
}