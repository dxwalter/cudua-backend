"use-strict"

const OrderController = require('../orderController');
const CartController = require('../../cart/CartController');
const CreateNotification = require('../../notifications/action/createNotification');
const UserController = require('../../user/UserController')

const shortId = require('shortid');
shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- ');

module.exports = class createOrder extends OrderController {
    constructor () {
        super();
        this.cartController = new CartController();
        this.notification = new CreateNotification();
        this.userController = new UserController()
        this.businessIdArray = [];
    }

    returnMethod (code, success, message, orderId = "") {
        return {
            code: code,
            success: success,
            message: message,
            orderId: orderId
        }
    }

    async checkOrder(orderId) {

        let check = await this.checkIfOrderIdExists(orderId);
        if (check.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again");

        if (check.result == null) {
            return true
        } else {
            return false
        }

    }

    sendCustomerNewOrderEmail(customerEmail, orderId) {
        
        let actionUrl = `https://cudua.com/c/orders/${orderId}`;

        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View Order Now</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                Congratulations! your order has been placed.
            </p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                Expect a call or message from the business you are buying from,
            </p>
        
        </div>
        `
        let subject = `You order was placed successfully`;
        let textPart = "but yet to be confirmed.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('no-reply@cudua.com', subject, customerEmail, messageBody, textPart, "Cudua");
    }

    sendBusinessNewOrderEmail (businessEmail, orderId) {

        let actionUrl = `https://cudua.com/b/orders/${orderId}`;
        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View Order Now</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">
                Congratulations! you have a new order that is awaiting confirmation.
            </p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">
                To see this order, you have to go to your <a href="https://cudua.com/b">SHOP MANAGER</a> to see the order. It is a good practice to first call the customer to know where they are buying from and discuss delivery charge before confirming the order. The phone number of the customer is on the order page.
            </p>
        
        </div>
        `
        let subject = `You have a new order`;
        let textPart = "that is awaiting confirmation.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('no-reply@cudua.com', subject, businessEmail, messageBody, textPart, "Cudua");

    }

    formatCartItems (cartItems, orderId, businessOwnerId) {

        let newCartArray = [];

        for (const [index, data] of cartItems.entries()) {

            if (data.business._id.toString() !== businessOwnerId.toString()) {
                newCartArray[index] = {
                    customer: data.owner._id,
                    product: data.product._id,
                    business: data.business._id,
                    quantity: data.quantity,
                    order_id: orderId
                }
                if (data.size != null) {
                    newCartArray[index]["size"] = data.size
                }

                if (data.color != null) {
                    newCartArray[index]["color"] = data.color
                }
                
                this.businessIdArray.push(data.business._id)
            }
            
        }

        return newCartArray;

    }

    async saveBusinessNotification(businessIdArray, orderId, message) {

        for (let id of businessIdArray) {
            
            // get business owners onesignal ID

            let businessOwnersBioData = await this.userController.findUsersByField({business_details: id});

            if (businessOwnersBioData.error == false) {
                let businessOwnerOnesignalId = businessOwnersBioData.result.oneSignalId;
                this.sendPushNotification(businessOwnerOnesignalId, `You have a new order awaiting confirmation. The new order ID is ${orderId}. Go to your shop manager to see order.`)
            } 

            await this.notification.createBusinessNotification(id, orderId, "order", "New Order", message);
        }

    }

    async getBusinessEmails (businessIdArray, cartItems) {
        
        let businessEmails = [];
        let businessOwnerObject = {};

        for (let id of businessIdArray) {
            
            for (let cartItem of cartItems) {

                if (cartItem.business.contact.email == undefined) {
                    // retrieve the business owners id, use the id to get the business owners personal email
                    let businessOwner = cartItem.business.owner;
                    // this is to check if the user details of the business owner has been retrieved before from db
                    // if it has, there is no point querying the db
                    if (businessOwnerObject[businessOwner] != undefined) businessEmails.push(businessOwnerObject[businessOwner])

                    // get the user details using businessOwner
                    let userData = await this.userController.findUsersById(businessOwner);

                    if (userData.error == false) {
                        businessOwnerObject[businessOwner] = userData.result.email;
                        businessEmails.push(userData.result.email)
                    }
                    
                } else {
                    businessEmails.push(cartItem.business.contact.email)
                }
            }

        }

        return Array.from(new Set(businessEmails))
    }

    async create(userId) {

        let getItemsInCart = await  this.cartController.findItemsByUserId(userId);

        if (getItemsInCart.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again");

        if (getItemsInCart.result.length == 0) return this.returnMethod(200, false, "You do not have any item in your cart");

        let cartProducts = [];
        
        for (let x of getItemsInCart.result) {
            if(x.product != null) {
                cartProducts.push(x)
            }
        }

        // get orderID
        let orderId = await this.generateId();

        // check if orderId exists
        let checkOrderStatus = await this.checkOrder(orderId);

        if (checkOrderStatus == false) {
            orderId = orderId + "RF";
        }

        let customerDetails = await this.userController.findUsersById(userId);

        let customersOnesignal = customerDetails.result.oneSignalId;


        if (customerDetails.error) return this.returnMethod(200, false, "An error occurred. Please try again");

        let businessOwnerId = customerDetails.result.business_details == undefined ? "" : customerDetails.result.business_details;


        // format cart items and add orderId
        let newData = this.formatCartItems(cartProducts, orderId, businessOwnerId);
        
        if (newData.length == 0 && cartProducts > 0) return this.returnMethod(200, false, "An error occurred. You cannot order your own product.")

        let newBusinessId =  Array.from(new Set(this.businessIdArray));

        // save orders by business
        let businessOrder = [];

        for(let businessId of newBusinessId) {
            businessOrder.push({
                customer: userId,
                business: businessId,
                order_id: orderId,
            })
        }

        let saveOrderForBusiness = await this.saveBusinessOrder(businessOrder);


        if (saveOrderForBusiness.error) return this.returnMethod(500, false, "An error occurred creating your order. Please try again");

        let saveData = await this.saveOrder(newData);
        
        if (saveData.error) return this.returnMethod(500, false, "An error occurred creating your order. Please try again");

        // create customer notification
        let notificationMessage = `Your order has been created successfully. Your order ID is ${orderId}`

        let createCustomerNotification = await this.notification.createCustomerNotification(userId, orderId, "order", "Order created", notificationMessage);

        if (customersOnesignal.length > 0) {
            this.sendPushNotification(customersOnesignal, `Your order was created successfully and your order ID is ${orderId}`);
        }

        // create business notification
        let businessNotificationMessage = `You have a new order and it is awaiting confirmation. The order ID is ${orderId}`;

        let saveBusinessNotification = await this.saveBusinessNotification(newBusinessId, orderId, businessNotificationMessage);

        // send emails to customer and business owners
        let getBusinessEmails = await this.getBusinessEmails(newBusinessId, cartProducts)
        
        // send business email
        
        for (let businessEmail of getBusinessEmails) {
            this.sendBusinessNewOrderEmail(businessEmail, orderId)
        }

        // get customer email and email_notification

        let customerEmail = cartProducts[0].owner.email;
        let customerEmailSetting = cartProducts[0].owner.email_notification;

        if (customerEmailSetting) {
            // send this customer an email
            this.sendCustomerNewOrderEmail(customerEmail, orderId);
        }

        // delete items from cart
        this.cartController.deleteAllCartItemsByUserId(userId)
        
        return this.returnMethod(200, true, notificationMessage, orderId)
        

    }
}