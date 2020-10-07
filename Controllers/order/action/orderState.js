"use-strict"

const OrderController = require('../orderController');
const BusinessController = require('../../business/BusinessController');
const CreateNotification = require('../../notifications/action/createNotification')

module.exports = class OrderStatus extends OrderController {

    constructor () {
        super();
        this.businessController = new BusinessController();
        this.createNotification = new CreateNotification();
    }

    
    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async confirmOrder(businessId, customerId, orderId, deliveryPrice, userId, startTime, endTime) {

        if (businessId.length < 1) return this.returnMethod(200, false, "Your business credential was not provided. Refresh and try again")  
        if (customerId.length < 1) return this.returnMethod(200, false, "The customer's credential was not provided. Refresh and try again")  
        if (orderId.length < 1) return this.returnMethod(200, false, "The order id was not provided was not provided. Refresh and try again")  

        if (startTime.length == 0 || endTime.length == 0) return this.returnMethod(200, false, "The delivery time span for this order was not provided")

        // check if business exists
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnMethod(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. Sign out and sign in to continue`)
            }
        }

        // confirm order
        let updateOrder = {
            order_status: 1,
            delivery_charge: deliveryPrice,
            delivery_time: {
                start: startTime,
                end: endTime
            }
        }

        let findAndUpdate = await this.confirmCustomerOrder(businessId, customerId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while confirming order. Please try again");

        //notify customer
        let alertCustomer = await this.createNotification.createCustomerNotification(customerId, orderId, "order", "Confirmed order", `Your order with ID ${orderId} has been confirmed. Click to find out more details.`);

        return this.returnMethod(202, true, `Order was confirmed successfully`)

    }

    async deleteOrder(orderId, businessId, customerId) {

        if (!orderId || !businessId || !customerId) {
            return this.returnMethod(200, false, "An error occurred. Kindly refresh and try again");
        }

        let deleteOrder = await this.deleteOrderFromDb(orderId, customerId, businessId);

        if (deleteOrder.error) return this.returnMethod(200, false, "An error occurred. Kindly refresh and try again");

        if (deleteOrder.result == false) return this.returnMethod(200, false, "An error occurred. Kindly refresh and try again");

        let deleteProductsInOrder = await this.deleteAllProductsInOrderFromDb(orderId, customerId, businessId);

        if (deleteProductsInOrder.error) return this.returnMethod(200, false, "An error occurred. Kindly refresh and try again");

        if (deleteProductsInOrder.result == false) return this.returnMethod(200, false, "An error occurred. Kindly refresh and try again");

        return this.returnMethod(200, true, "Order was deleted successfully");

    }

    async rejectOrder(businessId, customerId, orderId, reason, userId) {
        
        if (businessId.length < 1) return this.returnMethod(200, false, "Your business credential was not provided. Refresh and try again")  
        if (customerId.length < 1) return this.returnMethod(200, false, "The customer's credential was not provided. Refresh and try again")  
        if (orderId.length < 1) return this.returnMethod(200, false, "The order id was not provided was not provided. Refresh and try again")  

        // check if business exists
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnMethod(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. Sign out and sign in to continue`)
            }
        }

        if (reason.length < 1) return this.returnMethod(200, false, "Take sometime to tell the customer why you are rejecting the order.")

        // reject order
        let updateOrder = {
            order_status: -1,
            reject_order_reason: reason
        }

        let findAndUpdate = await this.confirmCustomerOrder(businessId, customerId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while rejecting order. Please try again");

        //notify customer
        let alertCustomer = await this.createNotification.createCustomerNotification(customerId, orderId, "order", "Rejected order", `Your order was rejected by ${businessData.result.businessname}. Click to find out more`);

        return this.returnMethod(202, true, `Order was rejected successfully`);
    }

    async updateDeliveryCharge (businessId, customerId, orderId, deliveryPrice, userId, startTime, endTime) {

        if (businessId.length < 1) return this.returnMethod(200, false, "Your business credential was not provided. Refresh and try again")  
        if (customerId.length < 1) return this.returnMethod(200, false, "The customer's credential was not provided. Refresh and try again")  
        if (orderId.length < 1) return this.returnMethod(200, false, "The order id was not provided was not provided. Refresh and try again")  
        
        if (startTime.length == 0 || endTime.length == 0) return this.returnMethod(200, false, "The delivery time span for this order was not provided")

        // check if business exists
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnMethod(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. Sign out and sign in to continue`)
            }
        }

        // update price
        let updateOrder = {
            order_status: 1,
            delivery_charge: deliveryPrice,
            delivery_time: {
                start: startTime,
                end: endTime
            }
        }

        let findAndUpdate = await this.confirmCustomerOrder(businessId, customerId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while updating delivery price for order. Please try again");

        //notify customer
        let alertCustomer = await this.createNotification.createCustomerNotification(customerId, orderId, "order", "New delivery price", `The delivery price and time for your order with ID ${orderId} has been updated. Click to find out more details.`);

        return this.returnMethod(202, true, `Order was updated successfully`);

    }

    async RejectDelivery(businessId, orderId, userId) {
        if (businessId.length < 1) return this.returnMethod(200, false, "The business credential was not provided. Refresh and try again")

        if (orderId.length < 1) return this.returnMethod(200, false, "Your order ID was not provided. Refresh and try again");

        let updateOrder = {
            delivery_status: -1
        }

        let findAndUpdate = await this.confirmCustomerOrder(businessId, userId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while updating rejecting delivery. Please try again");

        //notify business owner
        let alertBusinessOwner = await this.createNotification.createBusinessNotification(businessId, orderId, "order", "Rejected delivery", `The delivery with order ID ${orderId} was rejected. Click to learn more`);

        return this.returnMethod(200, true, `Delivery rejected successfully`);

    }

}