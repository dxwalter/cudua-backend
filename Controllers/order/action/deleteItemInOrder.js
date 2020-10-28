"use-strict"

const OrderController = require('../orderController');
const CreateNotification = require('../../notifications/action/createNotification');
const UserController = require('../../user/UserController');

module.exports = class DeleteItemInOrder extends OrderController {
    constructor () {
        super();
        this.notification = new CreateNotification();
        this.userController = new UserController()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async deleteItem (orderId, productId, userId) {
        
        if (orderId.length == false || productId.length == false) return this.returnMethod(200, false, "Please provide the correct credentials to perform this operation")

        // get item from order
        let getProduct = await this.getItemFromOrder(orderId, productId, userId);

        if (getProduct.error  || getProduct.result == null) return this.returnMethod(500, false, "This product has been moved or deleted from your order")

        getProduct = getProduct.result

        if (getProduct.order_status == 1) return this.returnMethod(200, false, "This item cannot be removed from your order. Call the the business to revoke the delivery of the product");

        let deleteItem = await this.deleteItemFromOrder(orderId, productId, userId);

        if (deleteItem.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again")

        if (deleteItem.result == true) {

            return this.returnMethod(200, true, `${getProduct.product.name} was removed successfully`);

        } else if (deleteItem.result == false) {
        
            return this.returnMethod(200, false, `${getProduct.product.name} could not be removed. Please try again`);

        }

    }
 
}