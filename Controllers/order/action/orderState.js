"use-strict"

const OrderController = require('../orderController');
const BusinessController = require('../../business/BusinessController');
const CreateNotification = require('../../notifications/action/createNotification');
const AccountingController = require('../../accounting/AccountingController');
const UserController = require('../../user/UserController');
const AccountingModel = require('../../../Models/AccountingModel');

module.exports = class OrderStatus extends OrderController {

    constructor () {
        super();
        this.businessController = new BusinessController();
        this.createNotification = new CreateNotification();
        this.accountingController = new AccountingController()
        this.UserController = new UserController()
    }

    
    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }


    deliveryConfirmationEmail (emailAddress, orderId, recipient) {

        let actionUrl, emailAction, emailMessage, messageBody, subject, textPart;

        if (recipient == "business") {

            actionUrl = `https://cudua.com/b/orders/${orderId}`;

            emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Write a Customer Review</a>`;
    
            emailMessage =`
            <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
            
                <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                    Order delivery confirmed
                </p>
    
                <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                    The delivery of the order with order ID ${orderId} has been confirmed by the customer that placed the order. Write about your experience with this customer to help other business owners decide if they can do business with this customer.
                </p>
            
            </div>
            `
            subject = `A delivered order  has been confirmed`;
            textPart = "by a customer";
    
    
            messageBody = this.emailMessageUi(subject, emailAction, emailMessage);
    
            this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");

        } else {

            actionUrl = `https://cudua.com/c/orders/cleared/${orderId}`;

            emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Write a review</a>`;
    
            emailMessage =`
            <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
            
                <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                    Order delivery confirmed.
                </p>
    
                <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                    The order with order ID ${orderId} has been confirmed by you the customer that placed the order. You can write a product and business review to help other customer's buying decision.
                </p>
            
            </div>
            `
            subject = `A delivered order  has been confirmed`;
            textPart = "by you";
    
    
            messageBody = this.emailMessageUi(subject, emailAction, emailMessage);
    
            this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");

        }
    }

    paymentConfirmationEmail (emailAddress, orderId, recipient) {
        
        let actionUrl, emailAction, emailMessage, messageBody, subject, textPart;

        if (recipient == 'business') {

            actionUrl = `https://cudua.com/b/orders/${orderId}`;

            emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View order details</a>`;
    
            emailMessage =`
            <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
            
                <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                    New payment.
                </p>
    
                <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                    A customer just paid for an order and it is awaiting delivery from you. To see order details about the order, click the link below. 
                </p>
            
            </div>
            `
            subject = `A new payment made was successful`;
            textPart = "but awaiting delivery";
    
    
            messageBody = this.emailMessageUi(subject, emailAction, emailMessage);
    
            this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");


        } else {

            actionUrl = `https://cudua.com/c/orders/${orderId}`;

            emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View order details</a>`;
    
            emailMessage =`
            <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
            
                <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                    Your payment was successful.
                </p>
    
                <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                    You have successfully paid for your order with ID ${orderId}. Your order is awaiting delivery. Click to learn more.
                </p>
            
            </div>
            `
            subject = `Your order payment was successful`;
            textPart = "but awaiting delivery";
    
    
            messageBody = this.emailMessageUi(subject, emailAction, emailMessage);
    
            this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");

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
            if (businessData.result.owner._id != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. Sign out and sign in to continue`)
            }
        }

        let getCustomerData = await this.UserController.findUsersById(customerId);

        if (getCustomerData.error)  return this.returnMethod(500, false, "An error occurred while confirming order. Please try again");

        let oneSignalId = getCustomerData.result.oneSignalId;
        let customerEmail = getCustomerData.result.email

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

        if (findAndUpdate.error || findAndUpdate.result == false) return this.returnMethod(500, false, "An error occurred while confirming order. Please try again");

        //notify customer
        let alertCustomer = await this.createNotification.createCustomerNotification(customerId, orderId, "order", "Confirmed order", `Your order with ID ${orderId} has been confirmed. Click to find out more details.`);

        if (oneSignalId.length > 0) {
            this.sendPushNotification(oneSignalId, `Your order with ID ${orderId} has been confirmed`);
        }
        
        let actionUrl = `https://cudua.com/c/orders/${orderId}`;

        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View Order Now</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                Congratulations! your order has been confirmed.
            </p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                Your order with order ID ${orderId} has been confirmed. View your order to learn more about payment method, delivery method, delivery charge and, delivery timeline.
            </p>
        
        </div>
        `
        let subject = `You order has been confirmed`;
        let textPart = "and awaiting delivery.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);


        await this.sendMail('Cudua@cudua.com', subject, customerEmail, messageBody, textPart, "Cudua");

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
            if (businessData.result.owner._id != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. Sign out and sign in to continue`)
            }
        }

        if (reason.length < 1) return this.returnMethod(200, false, "Take sometime to tell the customer why you are rejecting the order.")

        // reject order
        let updateOrder = {
            order_status: -1,
            reject_order_reason: reason
        }


        let getCustomerData = await this.UserController.findUsersById(customerId);

        if (getCustomerData.error)  return this.returnMethod(500, false, "An error occurred while confirming order. Please try again");

        let oneSignalId = getCustomerData.result.oneSignalId;
        let customerEmail = getCustomerData.result.email

        let findAndUpdate = await this.confirmCustomerOrder(businessId, customerId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) await this.returnMethod(500, false, "An error occurred while rejecting order. Please try again");

        //notify customer
        let alertCustomer = await this.createNotification.createCustomerNotification(customerId, orderId, "order", "Declined order", `Your order was declined by ${businessData.result.businessname}. Click to find out more`);

        
        if (oneSignalId.length > 0) {
            this.sendPushNotification(oneSignalId, `Your order was declined by ${businessData.result.businessname}. Click to find out more`);
        }

        let actionUrl = `https://cudua.com/c/orders/${orderId}`;

        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View Order Details</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                Oops! Your order was declined.
            </p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                Your order with order ID ${orderId} has been declined by the business that owns the product. To know why the order was declined, go to your order details page.
            </p>
        
        </div>
        `
        let subject = `You order has been declined`;
        let textPart = "by the business you are buying from";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, customerEmail, messageBody, textPart, "Cudua");

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

        let businessDetails = await this.businessController.getBusinessData(businessId);

        if (businessDetails.error) return this.returnMethod(500, false, "An error occurred while cancelling this order. Please try again")

        let businessOneSignalId = businessDetails.result.owner.oneSignalId;
        let businessEmailAddress = businessDetails.result.owner.email;

        let findAndUpdate = await this.confirmCustomerOrder(businessId, userId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) return this.returnMethod(500, false, "An error occurred while cancelling this order. Please try again");

        //notify customer
        let alertBusinessOwner = await this.createNotification.createBusinessNotification(businessId, orderId, "order", "Cancelled order", `The order with ID ${orderId} was cancelled by the customer. Click to learn more`);

        // send push notification
        if (businessOneSignalId.length > 0) {
            this.sendPushNotification(businessOneSignalId, `The order with ID ${orderId} was cancelled by the customer. Sign into your shop manager to learn more`)
        }

        let actionUrl = `https://cudua.com/b/orders/${orderId}`;

        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View Order Details</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                Oops! An order was cancelled by the customer.
            </p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                The order with order ID ${orderId} has been cancelled by the customer that placed the order. To know why the order was declined, go to your order details page.
            </p>
        
        </div>
        `
        let subject = `An order has been cancelled`;
        let textPart = "by the customer.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, businessEmailAddress, messageBody, textPart, "Cudua");

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
            if (businessData.result.owner._id != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. Sign out and sign in to continue`)
            }
        }

        let getCustomerData = await this.UserController.findUsersById(customerId);

        if (getCustomerData.error)  return this.returnMethod(500, false, "An error occurred while confirming order. Please try again");

        let oneSignalId = getCustomerData.result.oneSignalId;
        let customerEmail = getCustomerData.result.email;

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

        if (oneSignalId.length > 0) {
            this.sendPushNotification(oneSignalId, `The delivery price, payment method and delivery time for your order with ID ${orderId} has been changed. Click to find out more details.`);
        }


        let actionUrl = `https://cudua.com/c/orders/${orderId}`;

        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View Order Details</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                Your order details were updated.
            </p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                The details of your order with order ID ${orderId} has been changed by the business that owns the product. To see the new changes, go to your order details page.
            </p>
        
        </div>
        `
        let subject = `Order details updated`;
        let textPart = "by the business you want to buy from";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, customerEmail, messageBody, textPart, "Cudua");

        return this.returnMethod(202, true, `Order was updated successfully`);

    }

    async RejectDelivery(businessId, orderId, userId) {

        if (businessId.length < 1) return this.returnMethod(200, false, "The business credential was not provided. Refresh and try again")

        if (orderId.length < 1) return this.returnMethod(200, false, "Your order ID was not provided. Refresh and try again");

        let updateOrder = {
            delivery_status: -1
        }

        let businessData = await this.businessController.getBusinessData(businessId);
        if (businessData.error) return this.returnMethod(500, false, "An error occurred while updating rejecting delivery. Please try again")

        // one signal id
        let businessOneSignalId = businessDetails.result.owner.oneSignalId;
        let businessEmailAddress = businessDetails.result.owner.email;

        
        let findAndUpdate = await this.confirmCustomerOrder(businessId, userId, orderId, updateOrder);

        if (findAndUpdate.error || findAndUpdate.result == false) return this.returnMethod(500, false, "An error occurred while updating rejecting delivery. Please try again");

        //notify business owner
        let alertBusinessOwner = await this.createNotification.createBusinessNotification(businessId, orderId, "order", "Rejected delivery", `The delivery with order ID ${orderId} was rejected. Click to learn more`);

        if (businessOneSignalId.length > 0) {
            this.sendPushNotification(businessOneSignalId, `The delivery with order ID ${orderId} was declined. Got to shop manager to learn more`)
        }

        // send email

        let actionUrl = `https://cudua.com/b/orders/${orderId}`;

        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View Order Details</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                Rejected delivery.
            </p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                The order with order ID ${orderId} has been rejected by the customer that placed the order. To know why the order was rejected, go to your order details page and call the customer.
            </p>
        
        </div>
        `
        let subject = `An order has been rejected`;
        let textPart = "by a customer";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, businessEmailAddress, messageBody, textPart, "Cudua");

        // end of send email

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


        // business one signal id

        let businessDetails = await this.businessController.getBusinessData(businessId);
        if (businessDetails.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let businessOneSignalId = businessDetails.result.owner.oneSignalId;
        let businessEmailAddress = businessDetails.result.owner.email


        let customerDetails = await this.UserController.findUsersById(userId)
        if (customerDetails.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);
        let customerEmailAddress = customerDetails.result.email;
        let customerOneSignalId = customerDetails.result.oneSignalId

        //notify business owner
        let alertBusinessOwner = await this.createNotification.createBusinessNotification(businessId, orderId, "order", "Confirmed delivery", `The delivery with order ID ${orderId} was confirmed. Click to learn more`);

        if (businessOneSignalId) {
            this.sendPushNotification(businessOneSignalId, `The delivery with order ID ${orderId} was confirmed. Click to learn more`)
        }

        this.deliveryConfirmationEmail(businessEmailAddress, orderId, "business");


        // notify customer
        let alertCustomer = await this.createNotification.createCustomerNotification(userId, orderId, "order", "Confirmed delivery", `The delivery with order ID ${orderId} was confirmed. Click to learn more`);

        if (customerOneSignalId) {
            this.sendPushNotification(customerOneSignalId, `The delivery with order ID ${orderId} was confirmed. Click to learn more`)
        }

        this.deliveryConfirmationEmail(customerEmailAddress, orderId, "customer")

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

        // business one signal id

        let businessDetails = await this.businessController.getBusinessData(businessId);
        if (businessDetails.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let businessOneSignalId = businessDetails.result.owner.oneSignalId;
        let businessEmailAddress = businessDetails.result.owner.email

        this.deliveryConfirmationEmail(businessEmailAddress, orderId, "business");

        if (businessOneSignalId) {
            this.sendPushNotification(businessOneSignalId, `The deliver of the order with order ID ${orderId} was confirmed by the customer`)
        }


        let customerDetails = await this.UserController.findUsersById(userId)
        if (customerDetails.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);
        let customerEmailAddress = customerDetails.result.email;
        let customerOneSignalId = customerDetails.result.oneSignalId


        // notify customer
        let alertCustomer = await this.createNotification.createCustomerNotification(userId, orderId, "order", "Confirmed delivery", `The delivery with order ID ${orderId} was confirmed. Click to learn more`);

        if (customerOneSignalId) {
            this.sendPushNotification(customerOneSignalId, `The delivery with order ID ${orderId} was confirmed. Click to learn more`)
        }

        this.deliveryConfirmationEmail(customerEmailAddress, orderId, "customer")

        return this.returnMethod(200, true, `Order Delivery confirmed successfully`);
    }

    // This is to confirm payment by the customer. This works for orders paid for online/offline
    async ConfirmPayment (orderId, businessId, referenceId, userId, paymentMethod) {


        if (orderId.length == 0 || businessId.length == 0 || referenceId.length == 0) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let getAllProductsInOrder = await this.findProductsInOrder(businessId, userId, orderId);

        if (getAllProductsInOrder.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        // business one signal id

        let businessDetails = await this.businessController.getBusinessData(businessId);
        if (businessDetails.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let businessOneSignalId = businessDetails.result.owner.oneSignalId;
        let businessEmailAddress = businessDetails.result.owner.email


        // customer one signal id
        let customerDetails = await this.UserController.findUsersById(userId);
        if (customerDetails.error) return this.returnMethod(500, false, `An error occurred while confirming your payment`);

        let customerOneSignalId = customerDetails.result.oneSignalId;
        let customerEmailAddress = customerDetails.result.email;

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

        this.paymentConfirmationEmail(businessEmailAddress, orderId, "business")

        let alertCustomer = await this.createNotification.createCustomerNotification(userId, orderId, "order", "Confirmed payment", `You have successfully paid for your order with ID ${orderId}. Your order is awaiting delivery. Click to learn more.`);

        if (businessOneSignalId) {
            this.sendPushNotification(businessOneSignalId, "A customer just paid for an order. Click to learn more")
        }

        if (customerOneSignalId) {
            this.sendPushNotification(customerOneSignalId, `You have successfully paid for your order with ID ${orderId}. Your order is awaiting delivery. Click to learn more.`)
        }

        this.paymentConfirmationEmail(customerEmailAddress, orderId, "customer")

        return this.returnMethod(200, true, `Your payment was successful and documented`);
        

    }

}