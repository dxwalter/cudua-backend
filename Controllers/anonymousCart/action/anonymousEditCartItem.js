'use-strict'

const AnonymousCartController = require('../anonymousCartController');
const LocationController = require('../../Location/LocationController');

module.exports = class EditItemsInCart extends AnonymousCartController {
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

    async editProductQuantity(itemId, quantity = 1) {
    
        if (itemId.length < 1) return this.returnMethod(500, false, "An error occurred. Refresh page and try again");
        
        let updateData = await this.findOneAndUpdate(itemId, {quantity: quantity})

        if (updateData.error) return this.returnMethod(200, false, "An error occurred. Kindly try again");

        return this.returnMethod(200, true, "Quantity updated")
    }

    async editProductSizeAndColor (itemId, sizeId, colorId) {

        if (itemId.length < 1) return this.returnMethod(500, false, "An error occurred. Refresh page and try again");

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