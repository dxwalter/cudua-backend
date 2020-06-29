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

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")

        getProductDetails = getProductDetails.result;

        tags = tags.map(x => this.MakeFirstLetterUpperCase(x))
        let mainTags = Array.from(new Set(tags))

        if (getProductDetails.tags.length == 0) {
            let newTag = {tags: mainTags}
            let tagUpdate = await this.findOneAndUpdate(productId, newTag);

            if (tagUpdate.error == true) {
                return this.returnData(500, false, `An error occurred updating the tags for ${getProductDetails.name}`)
            }

            return this.returnData(202, true, `The tags for ${getProductDetails.name} was updated successfully`);
        }


        // update tag in db
        let newArrayTag = getProductDetails.tags.concat(tags)
        newArrayTag = newArrayTag.map(x => this.MakeFirstLetterUpperCase(x))
        let newMainTags = Array.from(new Set(newArrayTag))

        let newTag = {tags: newMainTags}
        let tagUpdate = await this.findOneAndUpdate(productId, newTag);

        if (tagUpdate.error == true) {
            return this.returnData(500, false, `An error occurred updating the tags for ${getProductDetails.name}`)
        }

        return this.returnData(202, true, `The tags for ${getProductDetails.name} was updated successfully`);

        
    }

    async removeProductTag (tag, productId, businessId, userId) {

        if (tag.length < 1) return this.returnData(200, false, `Click on the tag you want to remove`)
        
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
        getProductDetails = getProductDetails.result
        
        let savedTags = getProductDetails.tags

        let userTag = this.MakeFirstLetterUpperCase(tag);

        for (const [index, tag] of savedTags.entries()) {
            if (userTag == tag) {
                savedTags.splice(index, 1);
            }
        }

        let newData = {tags: savedTags};
        let tagUpdate = await this.findOneAndUpdate(productId, newData);

        if (tagUpdate.error == true) {
            return this.returnData(500, false, `An error occurred removing ${userTag} tag`)
        }

        return this.returnData(202, true, `${userTag} was removed successfully`);
    }
}
