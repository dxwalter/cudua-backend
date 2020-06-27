
let ProductController = require('../ProductController')
let createBusinessCategory = require('../../businessCategory/action/createBusinessCategories');

module.exports = class CreateNewProduct extends ProductController {
    constructor () {
        super();
        let BusinessCategory = new createBusinessCategory()
    }

    returnData (businessId, code, success, message) {
        return {
            businessId: businessId,
            code: code,
            success: success,
            message: message
        }
    }

    async createProduct (name, price, category, subcategory, businessId, userId) {
        
        if (name.length < 3) {
            return this.returnData(null, 200, false, `Enter a valid name for the product you want to upload`)
        }

        if (price == false) {
            return this.returnData(null, 200, false, `Enter the price for the product you want to upload`)
        }

        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(null, 500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        if (category.length == false || subcategory.length == false) {
            return this.returnData(null, 200, false, `Choose a catgory and subcategory for the product you want to upload`)
        }

        let businessCategory = await this.BusinessCategory.ChooseCategory(businessId, category, [subcategory])
        console.log(businessCategory)

    }
}