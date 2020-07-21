"use-strict"

const OrderController = require('../orderController');
const BusinessController = require('../../business/BusinessController')

module.exports = class GetOrders extends OrderController {

    constructor () {
        super();
        this.businessController = new BusinessController()
    }

    returnMethod (data, code, success, message) {
        return {
            orders: data,
            code: code,
            success: success,
            message: message
        }
    }

    formartOrderData(orderData) {
        let newOrder = [];
        let pendingOrder = [];
        let clearedOrder = [];
        let orderObject = {};

        for (let orderItem of orderData) {
            if (orderObject[orderItem.order_id] == undefined) {

                // new order that is yet to be confirmed
                if (orderItem.order_status == 0) {
                    newOrder.push({
                        customerName: orderItem.customer.fullname,
                        profilePicture: orderItem.customer.profilePicture == undefined ? null : orderItem.customer.profilePicture,
                        orderTime: orderItem.created,
                        orderId: orderItem.order_id,
                    })
                }

                if (orderItem.order_status &&  orderItem.delivery_status != 1) {
                    pendingOrder.push({
                        customerName: orderItem.customer.fullname,
                        profilePicture: orderItem.customer.profilePicture == undefined ? null : orderItem.customer.profilePicture,
                        orderTime: orderItem.created,
                        orderId: orderItem.order_id,
                    })
                }

                // to check if an order has been cleared, the order status and delivery status must be 1
                if (orderItem.order_status && orderItem.delivery_status) {
                    clearedOrder.push({
                        customerName: orderItem.customer.fullname,
                        profilePicture: orderItem.customer.profilePicture == undefined ? null : orderItem.customer.profilePicture,
                        orderTime: orderItem.created,
                        orderId: orderItem.order_id,
                    })
                }

                // this is used to avoid returning more than one order id
                orderObject[orderItem.order_id] = "set"
            }
        }

        return {
            newOrder: newOrder.length > 0 ? newOrder : null,
            pendingOrder: pendingOrder.length > 0 ? pendingOrder : null,
            clearedOrder: clearedOrder.length > 0 ? clearedOrder : null
        }

    }

    async getOrderListingForBusiness (businessId, userId) {

        if (businessId.length < 1) return this.returnMethod(null, 200, false, "Your business credential was not provided.")  

        // check if business exists
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnMethod(null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnMethod(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getOrdersForBusiness = await this.getOrdersForBusiness(businessId);
        let formatOrder = this.formartOrderData(getOrdersForBusiness.result);

        return this.returnMethod(formatOrder, 200, true, "Orders retrieved successfully")


    }

}