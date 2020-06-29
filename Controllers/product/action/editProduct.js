const ProductModel = require('../../../Models/Product');
const ProductController = require('../ProductController');
const createBusinessCategory = require('../../businessCategory/action/createBusinessCategories');


module.exports = class EditProduct extends ProductController {

    constructor () {
        super();
        this.BusinessCategory = new createBusinessCategory();
    }

    returnData (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async editProductDescription(description, productId, businessId, userId) {

        if (description.length < 1) return this.returnData(200, false, "Type a description for this product");

        if (!productId || !businessId) return this.returnData(200, false, "Your business and product details were not provided. Kindly refresh the page and try again")
        
        // check if business exists
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")

        getProductDetails = getProductDetails.result;
 
        if (getProductDetails.description) {
            return this.returnData(200, false, "Edit the product description and try again")
        }

        if (getProductDetails.description == undefined || getProductDetails.description != description) {
            //update
            let newDescriptionObject = {description: description};
            let descriptionUpdate = await this.findOneAndUpdate(productId, newDescriptionObject);

            if (descriptionUpdate.error == true) {
                return this.returnData(500, false, `An error occurred updating the product description for ${getProductDetails.name}`)
            }

            return this.returnData(202, true, `The description for ${getProductDetails.name} was updated successfully`);

        }

    }

    async editProductTags(tags, productId, businessId, userId) {
        
        if (tags.length < 1) return this.returnData(200, false, "Enter one or multiple tags seperated by comma for this product");

        if (!productId || !businessId) return this.returnData(200, false, "Your business and product details were not provided. Kindly refresh the page and try again")
        
        // check if business exists
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let tagsArray = tags

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")

        getProductDetails = getProductDetails.result;

        
    }

    async removeProductTag (tag, productId, businessId, userId) {

    }
}
