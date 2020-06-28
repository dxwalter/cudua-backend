
let ProductModel = require('../../../Models/Product')
let ProductController = require('../ProductController')
let createBusinessCategory = require('../../businessCategory/action/createBusinessCategories');

module.exports = class CreateNewProduct extends ProductController {
    constructor () {
        super();
        this.BusinessCategory = new createBusinessCategory();
        this.businessProductPath = 'uploads/product';
    }

    returnData (productId, code, success, message) {
        return {
            productId: productId,
            code: code,
            success: success,
            message: message
        }
    }

    async createProduct (name, price, category, subcategory, businessId, file, userId) {
        
        if (name.length < 3) {
            return this.returnData(null, 200, false, `Enter a valid name for the product you want to upload`)
        }

        name = this.MakeFirstLetterUpperCase(name)

        if (price == false) {
            return this.returnData(null, 200, false, `Enter the price for the product you want to upload`)
        }

        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(null, 200, false, "Your business is not recognised.")
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
        
        if (businessCategory.code == 500) {
            return this.returnData(null, 500, false, `An error occurred. The category or subcategory you chose is not recognised.`)
        }

        const { filename, mimetype, createReadStream } = await file;

        if (filename.length < 1) {
            return this.returnData(null, 200, false, "Choose a photo of the product you want to upload")
        }

        // encrypt file name
        let newFileName = this.encryptFileName(filename) + "." + mimetype.split('/')[1];

        const stream = createReadStream();

        let path = this.businessProductPath;

        const pathObj = await this.uploadImageFile(stream, newFileName, path);

        if (pathObj.error == true) {
            return this.returnData(null, 500, false, "An error occurred uploading your product photo. Please try again")
        }

        //upload to cloudinary

        let createProduct = new ProductModel({
            name: name,
            price: price,
            category: category,
            subcategory: subcategory,
            primary_image: newFileName,
            business_id: businessId
        });

        let create = await this.InsertNewProduct(createProduct);

        if (create.error == true) {
            return this.returnData(null, 500, false, "An error occurred uploading your new product");
        }

        return this.returnData(create.result._id, 202, true, `${name} has been uploaded successfully`)

    }
}