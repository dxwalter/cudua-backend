'use-strict'

let ProductModel = require('../../../Models/Product')
let ProductController = require('../ProductController')
let createBusinessCategory = require('../../businessCategory/action/createBusinessCategories');

module.exports = class ProductVisibility extends ProductController {
    
    constructor () {
        super();
    }

    returnData (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }


    async HideProduct (productId, businessId, userId) {
        
        // check if business exists
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let hideProduct = await this.findOneAndUpdate(productId, {hide: 1});

        if (hideProduct.error == true) return this.returnData(500, false, `An error occurred while hiding your product`);

        return this.returnData(202, true, `Your product was hidden successfully`);
        

    }

    async ShowProduct (productId, businessId, userId) {
        
        // check if business exists
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let showProduct = await this.findOneAndUpdate(productId, {hide: 0});

        if (showProduct.error == true) return this.returnData(500, false, `An error occurred while showing your product`);

        return this.returnData(202, true, `Your product was successfully made visible`);
        

    }
}