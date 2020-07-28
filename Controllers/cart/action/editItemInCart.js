'use-strict'

const CartController = require('../CartController');
const LocationController = require('../../Location/LocationController');

module.exports = class EditItemsInCart extends CartController {
    constructor () { 
        super();
        this.locationController = new LocationController();
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async deleteItemInCartSignIn(itemId, userId) {

        if (itemId.length < 1)  return this.returnMethod(500, false, `An error occurred from our end. Refresh and try again`);

        let deleteItem = await this.deleteItemInCartByUserIdAndItemId(userId, itemId) 

        if (deleteItem.error == true || deleteItem.result == false) return this.returnMethod(200, false, `An error occurred from our end while removing your item from cart.`);

        return this.returnMethod(200, true, `An item was deleted successfully from your cart.`);

    }

    async updateQuantity (itemId, quantity) {
        
        if(quantity < 1) quantity = 1
        if (itemId.length < 1)  return this.returnMethod(500, false, `An error occurred from our end. Refresh and try again`);

        let newDataObject = {quantity: quantity};

        let updateData = await this.findOneAndUpdate(itemId, newDataObject);

        if (updateData.error == false) {
            return this.returnMethod(202, true, "The quantity of your item has been updated")
        } else {
            return this.returnMethod(500, false, "An error occurred updating the quantity of your item");
        }

    }

    async updateColor (itemId, color) {
        
        if (color.length < 1)  return this.returnMethod(200, false, `Select a new color`);

        if (itemId.length < 1)  return this.returnMethod(500, false, `An error occurred from our end. Refresh and try again`);

        let newDataObject = {color: color};

        let updateData = await this.findOneAndUpdate(itemId, newDataObject);

        if (updateData.error == false) {
            return this.returnMethod(202, true, "The color of your item has been updated")
        } else {
            return this.returnMethod(500, false, "An error occurred updating the color of your item");
        }

    }

    async updateSize (itemId, size) {
        
        if (size.length < 1)  return this.returnMethod(200, false, `Select a new size`);

        if (itemId.length < 1)  return this.returnMethod(500, false, `An error occurred from our end. Refresh and try again`);

        let newDataObject = {size: size};

        let updateData = await this.findOneAndUpdate(itemId, newDataObject);

        if (updateData.error == false) {
            return this.returnMethod(202, true, "The size of your item has been updated")
        } else {
            return this.returnMethod(500, false, "An error occurred updating the size of your item");
        }

    }
 
}