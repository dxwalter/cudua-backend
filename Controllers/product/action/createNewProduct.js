'use-strict'

const ProductModel = require('../../../Models/Product')
const ProductController = require('../ProductController')
const createBusinessCategory = require('../../businessCategory/action/createBusinessCategories');
const CreateNotification = require('../../notifications/action/createNotification')

module.exports = class CreateNewProduct extends ProductController {
    
    constructor () {
        super();
        this.BusinessCategory = new createBusinessCategory();
        this.businessProductPath = 'uploads/product/';
        this.createNotification = new CreateNotification()
    }

    returnData (productId, code, success, message) {
        return {
            productId: productId,
            code: code,
            success: success,
            message: message
        }
    }

    async createProductFromInstagram (name, price, category, subcategory, businessId, imagePath, description, userId) {

        if (name.length < 3) {
            return this.returnData(null, 200, false, `Enter a valid name for the product you want to upload`)
        }

        name = this.MakeFirstLetterUpperCase(name);

        if (imagePath.length < 3) {
            return this.returnData(null, 200, false, `The image path for this product was not understood. Please try again`)
        }

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

        let businessUsername = businessData.result.username;

        if (category.length == false || subcategory.length == false) {
            return this.returnData(null, 200, false, `Choose a catgory and subcategory for the product you want to upload`)
        }

        let businessCategory = await this.BusinessCategory.addASingleCategoryOrSubcategory(businessId, category, subcategory)
        
        if (businessCategory.code == 500) {
            return this.returnData(null, 500, false, `An error occurred. The category or subcategory you chose is not recognised.`)
        }




        // upload file
        let encryptedName = this.encryptFileName(await this.generateId());
        let newFileName = encryptedName + ".jpg";
        let publicId = encryptedName;
        let tag = 'product';

        //upload to cloudinary
        let folder = process.env.CLOUDINARY_FOLDER+"/business/"+businessId+"/product/";

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

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
            description: description
        });

        let create = await this.InsertNewProduct(createProduct);

        if (create.error == true) {
            return this.returnData(null, 500, false, "An error occurred uploading your new product");
        }

        // check product count
        let countProducts = await this.countBusinessProducts({business_id: businessId});
        if (countProducts == 5 || countProducts == 12 || countProducts == 20) {
            // create admin notification
            this.createNotification.CreateAdminNotification(businessUsername, "Business", "Free flier", `A business has uploaded their ${countProducts}th product. A digital flier has to be sent to them.`)
        }

        return this.returnData(create.result._id, 202, true, `${name} has been uploaded successfully`)



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

        let businessUsername = businessData.result.username

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
        let folder = process.env.CLOUDINARY_FOLDER+"/business/"+businessId+"/product/";
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
            this.createNotification.CreateAdminNotification(businessUsername, "Business", "Free flier", `A business has uploaded their ${countProducts}th product. A digital flier has to be sent to them.`)
        }

        return this.returnData(create.result._id, 202, true, `${name} has been uploaded successfully`)

    }
}