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

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async generateOrderId () {
        let orderId = shortId.generate();

        if (orderId.search(" ") > -1 ){
            orderId = orderId.replace(" ", "")
        } 
        
        if (orderId.search("-") > -1 ) {
            orderId = orderId.replace("-", "")
        }

        return orderId.toUpperCase();

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

    formatCartItems (cartItems, orderId) {

        let newCartArray = [];

        for (const [index, data] of cartItems.entries()) {
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

        return newCartArray;

    }

    async saveBusinessNotification(businessIdArray, orderId, message) {

        for (let id of businessIdArray) {
            await this.notification.createBusinessNotification(id, orderId, message);
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

        // get orderID
        let orderId = await this.generateOrderId()

        // check if orderId exists
        let checkOrderStatus = await this.checkOrder(orderId);

        if (checkOrderStatus == false) {
            orderId = orderId + "RF";
        }

        // format cart items and add orderId

        let newData = this.formatCartItems(getItemsInCart.result, orderId);

        let saveData = await this.saveOrder(newData);
        
        if (saveData.error) return this.returnMethod(500, false, "An error occurred creating your order. Please try again");

        // create customer notification
        let notificationMessage = `Your order has been created successfully. Your order ID is ${orderId}`
        let createCustomerNotification = await this.notification.createCustomerNotification(userId, orderId, notificationMessage);

        // create business notification
        let businessNotificationMessage = `You have a new order and it is awaiting confirmation. The order ID is ${orderId}`;
        let newBusinessId =  Array.from(new Set(this.businessIdArray));

        let saveBusinessNotification = await this.saveBusinessNotification(newBusinessId, orderId, businessNotificationMessage);

        // send emails to customer and business owners
        let getBusinessEmails = await this.getBusinessEmails(newBusinessId, getItemsInCart.result)
        // send business email
        console.log(getBusinessEmails)

        // get customer email and email_notification

        let customerEmail = getItemsInCart.result[0].owner.email;
        let customerEmailSetting = getItemsInCart.result[0].owner.email_notification;

        if (customerEmailSetting) {
            // send this customer an email
        }

        console.log(customerEmailSetting)
        console.log(customerEmail)

        // remove items from cart

        // delete items from cart
        return this.returnMethod(200, true, notificationMessage)
        

    }
}