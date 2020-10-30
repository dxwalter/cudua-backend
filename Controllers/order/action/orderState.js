"use-strict"

const OrderController = require('../orderController');
const BusinessController = require('../../business/BusinessController');
const CreateNotification = require('../../notifications/action/createNotification');
const AccountingController = require('../../accounting/AccountingController');
const AccountingModel = require('../../../Models/AccountingModel');

module.exports = class OrderStatus extends OrderController {

    constructor () {
        super();
        this.businessController = new BusinessController();
        this.createNotification = new CreateNotification();
        this.accountingController = new AccountingController()
    }

    
    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async confirmOrder(businessId, customerId, orderId, deliveryPrice, userId, startTime, endTime, paymentMethod) {

        if (businessId.length < 1) return this.returnMethod(200, false, "Your business credential was not provided. Refresh and try again")  
        if (customerId.length < 1) return this.returnMethod(200, false, "The customer's credential was not provided. Refresh and try again")  
        if (orderId.length < 1) return this.returnMethod(200, false, "The order id was not provided was not provided. Refresh and try again")  
        if (paymentMethod.length < 1) return this.returnMethod(200, false, "The payment method for this order was not specified.")  

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
            },
            payment_method: paymentMethod
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

    async businessRejectOrder(businessId, customerId, orderId, reason, userId) {
        
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


    async customerCancelOrder(businessId, orderId, reason, userId) {
        
        if (businessId.length < 1) return this.returnMethod(200, false, "Your business credential was not provided. Refresh and try again")  
        if (orderId.length < 1) return this.returnMethod(200, false, "The order id was not provided was not provided. Refresh and try again")  

        // reject order
        let updateOrder = {
            customer_cancel_order: 1,
            customer_cancel_order_reason: reason
        }

        let findAndUpdate = await this.confirmCustomerOrder(businessId, userId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while cancelling this order. Please try again");

        //notify customer
        let alertBusinessOwner = await this.createNotification.createBusinessNotification(businessId, orderId, "order", "Cancelled order", `The order with ID ${orderId} was cancelled by the customer. Click to learn more`);

        return this.returnMethod(202, true, `Order was cancelled successfully`);
    }

    async updateDeliveryCharge (businessId, customerId, orderId, deliveryPrice, userId, startTime, endTime, paymentMethod) {

        if (businessId.length < 1) return this.returnMethod(200, false, "Your business credential was not provided. Refresh and try again")  
        if (customerId.length < 1) return this.returnMethod(200, false, "The customer's credential was not provided. Refresh and try again")  
        if (orderId.length < 1) return this.returnMethod(200, false, "The order id was not provided was not provided. Refresh and try again")  
        if (paymentMethod.length < 1) return this.returnMethod(200, false, "The payment method for this order was not specified.")  
        
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
            },
            payment_method: paymentMethod
        }

        let findAndUpdate = await this.confirmCustomerOrder(businessId, customerId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while updating delivery price for order. Please try again");

        //notify customer
        let alertCustomer = await this.createNotification.createCustomerNotification(customerId, orderId, "order", "Order update", `The delivery price, payment method and delivery time for your order with ID ${orderId} has been updated. Click to find out more details.`);

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

    // when a customer pays on delivery, that means the product arrived and it is being confirmed by the customer.
    // At the same time, the customer will pay for the product.
    // this method is to confirm the payment and delivery of an order at once 
    async ConfirmOrderDeliveryPaidOffline(businessId, orderId, userId) {

        if (businessId.length < 1) return this.returnMethod(200, false, "The business credential was not provided. Refresh and try again")

        if (orderId.length < 1) return this.returnMethod(200, false, "Your order ID was not provided. Refresh and try again");


        let referenceId = await this.generateId();

        let confirmPayment = await this.ConfirmPayment(orderId, businessId, referenceId, userId, "Paid on delivery");

        if (confirmPayment.success == false) return this.returnMethod(confirmPayment.code, confirmPayment.success, confirmPayment.message)

        let updateOrder = {
            delivery_status: 1
        }

        let findAndUpdate = await this.confirmCustomerOrder(businessId, userId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while updating confirm delivery. Please try again");

        //notify business owner
        let alertBusinessOwner = await this.createNotification.createBusinessNotification(businessId, orderId, "order", "Confirmed delivery", `The delivery with order ID ${orderId} was confirmed. Click to learn more`);

        return this.returnMethod(200, true, `Order Delivery confirmed successfully`);
    }


    async DecideConfirmationType (businessId, orderId, userId) {
        if (businessId.length < 1) return this.returnMethod(200, false, "The business credential was not provided. Refresh and try again")

        if (orderId.length < 1) return this.returnMethod(200, false, "Your order ID was not provided. Refresh and try again");

        let orderMetadata = await this.getOrderMetaData(userId, businessId, orderId)

        if (orderMetadata.error) return this.returnMethod(200, false, "An error occurred. Kindly try again");

        if (orderMetadata.result.payment_method == 'Pay online') {
            return await this.ConfirmOrderDeliveryPaidOnline (businessId, orderId, userId);
        } else {
            return await this.ConfirmOrderDeliveryPaidOffline (businessId, orderId, userId)
        }


    }

    // when a customer pays for a product online, the order does not arrive immediately. This method is to confirm the delivery of the method when it
    async ConfirmOrderDeliveryPaidOnline (businessId, orderId, userId) {
        if (businessId.length < 1) return this.returnMethod(200, false, "The business credential was not provided. Refresh and try again")

        if (orderId.length < 1) return this.returnMethod(200, false, "Your order ID was not provided. Refresh and try again");

        let updateOrder = {
            delivery_status: 1
        }

        let findAndUpdate = await this.confirmCustomerOrder(businessId, userId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while updating confirm delivery. Please try again");

        //notify business owner
        let alertBusinessOwner = await this.createNotification.createBusinessNotification(businessId, orderId, "order", "Confirmed delivery", `The delivery with order ID ${orderId} was confirmed. Click to learn more`);

        return this.returnMethod(200, true, `Order Delivery confirmed successfully`);
    }

    // This is to confirm payment by the customer. This works for orders paid for online/offline
    async ConfirmPayment (orderId, businessId, referenceId, userId, paymentMethod) {


        if (orderId.length == 0 || businessId.length == 0 || referenceId.length == 0) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let getAllProductsInOrder = await this.findProductsInOrder(businessId, userId, orderId);

        if (getAllProductsInOrder.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let totalProductPrice = 0

        for (let x of getAllProductsInOrder.result) {
            totalProductPrice = totalProductPrice + (x.quantity * x.product.price)
        }


        let orderMetadata = await this.getOrderMetaData(userId, businessId, orderId)
        if (orderMetadata.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let totalOrderPrice = totalProductPrice + orderMetadata.result.delivery_charge

        // confirm payment
        let data = {payment_status: 1};

        let confirmOrderPayment = await this.confirmCustomerOrder(businessId, userId, orderId, data);

        if (confirmOrderPayment.error == true)  return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        // upload to accounting

        let newData = new AccountingModel({
            userId: userId,
            orderId: orderId,
            business: businessId,
            referenceId: referenceId,
            totalPrice: totalOrderPrice,
            paymentMethod: paymentMethod
        })

        let saveData = await this.accountingController.createAccountingRecord(newData)

        if (saveData.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let alertBusinessOwner = await this.createNotification.createBusinessNotification(businessId, orderId, "order", "New payment", `A customer just paid for an order. Click to learn more`);

        let alertCustomer = await this.createNotification.createCustomerNotification(userId, orderId, "order", "Confirmed payment", `You have successfully paid for your order with ID ${orderId}. Your order is awaiting delivery. Click to learn more.`);

        return this.returnMethod(200, true, `Your payment was successful and documented`);
        

    }

}