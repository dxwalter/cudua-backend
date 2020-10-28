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

    async updateColorAndSize (itemId, colorId, sizeId) {
        
        if (itemId.length < 1)  return this.returnMethod(500, false, `An error occurred from our end. Refresh and try again`);

        if (sizeId.length > 0) {
            let updateSize = await this.findOneAndUpdate(itemId, {size: sizeId})
            if (updateSize.error) return this.returnMethod(200, false, "An error occurred. Kindly try again");
        }

        if (colorId.length > 0) {
            let updateColor = await this.findOneAndUpdate(itemId, {color: colorId})
            if (updateColor.error) return this.returnMethod(200, false, "An error occurred. Kindly try again");
        }

        return this.returnMethod(200, true, "Cart updated successfully")

    }
 
}