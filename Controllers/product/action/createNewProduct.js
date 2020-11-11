'use-strict'

let ProductModel = require('../../../Models/Product')
let ProductController = require('../ProductController')
let createBusinessCategory = require('../../businessCategory/action/createBusinessCategories');

module.exports = class CreateNewProduct extends ProductController {
    
    constructor () {
        super();
        this.BusinessCategory = new createBusinessCategory();
        this.businessProductPath = 'uploads/product/';
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
            if (businessData.result.owner._id != userId) {
                return this.returnData(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        if (category.length == false || subcategory.length == false) {
            return this.returnData(null, 200, false, `Choose a catgory and subcategory for the product you want to upload`)
        }

        let businessCategory = await this.BusinessCategory.addASingleCategoryOrSubcategory(businessId, category, subcategory)
        
        if (businessCategory.code == 500) {
            return this.returnData(null, 500, false, `An error occurred. The category or subcategory you chose is not recognised.`)
        }


        // encrypt file name

        let encryptedName = this.encryptFileName(await this.generateId())
        let newFileName = encryptedName + "." + "jpg";


        //upload to cloudinary
        let folder = "cudua_commerce/business/"+businessId+"/product/";
        let publicId = encryptedName;
        let tag = 'product';
        // let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, file, publicId, tag);

        // let deleteFile = await this.deleteFileFromFolder(imagePath)

        if (moveToCloud.error == true) {
            return this.returnData(null, 500, false, `An error occurred creating ${name}`)
        }

        let createProduct = new ProductModel({
            name: name,
            price: price,
            category: category,
            subcategory: subcategory,
            primary_image: newFileName,
            images:[newFileName],
            business_id: businessId,
        });

        let create = await this.InsertNewProduct(createProduct);

        if (create.error == true) {
            return this.returnData(null, 500, false, "An error occurred uploading your new product");
        }

        // check product count
        let countProducts = await this.countBusinessProducts({business_id: businessId});
        if (countProducts == 5 || countProducts == 12 || countProducts == 20) {
            // create admin notification
        }

        return this.returnData(create.result._id, 202, true, `${name} has been uploaded successfully`)

    }
}