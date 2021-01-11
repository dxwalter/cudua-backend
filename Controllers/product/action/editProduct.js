'use-strict'

const ProductModel = require('../../../Models/Product');
const ProductController = require('../ProductController');
const createBusinessCategory = require('../../businessCategory/action/createBusinessCategories');
const Categories = require('../../../Models/Categories');
const SaveForLaterController = require('../../saveForLater/SaveForLaterController')
const CartController = require('../../cart/CartController');
const OrderController = require('../../order/orderController');
const AnonymousCartController = require('../../anonymousCart/anonymousCartController');

module.exports = class EditProduct extends ProductController {

    constructor () {
        super();
        this.BusinessCategory = new createBusinessCategory();
        this.SaveForLaterController = new SaveForLaterController()
        this.CartController = new CartController()
        this.OrderController = new OrderController()
        this.AnonymousCartController = new AnonymousCartController()
        this.businessProductPath = 'uploads/product/';
    }

    returnData (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    returnAvailableSizes (code, success, message, sizes = null) {
        return {
            code: code,
            success: success,
            message: message,
            sizes: sizes
        }
    }

    formatReturnedColor (colors) {
        let newArray = [];

        for (let x of colors) {
            newArray.push({
                colorId: x._id,
                color: x.color_codes
            })
        }

        return newArray
    }

    returnColorData (code, success, message, newData = null) {
        return {
            code: code,
            success: success,
            message: message,
            colors: newData
        }
    }

    uploadProductPhotoResponse (code, success, message, photos = null) {
        return {
            code: code,
            success: success,
            message: message,
            photos: photos
        }
    }

    async deleteProduct (productId, businessId) {

        if (productId.length == 0 || businessId.length == 0) return this.returnData(200, false, "An error occurred. Refresh page and try again");

        let getProduct  = await this.GetProductById(productId);

        if (getProduct.error) return this.returnData(500, false, "An error occurred deleting your product");

        if (getProduct.result == null) return this.returnData(500, false, "This product has been moved or deleted");

        // delete product
        let deleteProduct = await this.deleteProductById(productId, businessId);

        if (deleteProduct.error) return this.returnData(500, false, "An error occurred deleting your product");

        let images = getProduct.result.images;

        // delete image
        images.forEach(async image => {
            let publicID = `${process.env.CLOUDINARY_FOLDER}/business/${businessId}/product/${image.split('.')[0]}`;
            await this.removeFromCloudinary(publicID, 'image');
        });

        // delete from cart
        await this.CartController.deleteProductById(productId, businessId)

        // delete from saved items
        await this.SaveForLaterController.deleteProductById(productId, businessId)

        // delete from order product
        await this.OrderController.deleteProductById(productId, businessId);

        // delete from anonymous cart
        await this.AnonymousCartController.deleteProductById(productId, businessId)


        return this.returnData(200, true, `"${getProduct.result.name}" was deleted successfully`);
    }

    async editProductBasicDetails (name, price, category, subcategory, businessId, productId, userId) {
        
        let dataObject = {};
        let dataChange = 0;

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

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null) return this.returnData(200, false, "This product does not exist");

        getProductDetails = getProductDetails.result;

        if (name.length > 2) {
            if (name != getProductDetails.name) {
                dataObject.name = this.MakeFirstLetterUpperCase(name); 
                dataChange = 1;
            }
        } else  {
            return this.returnData(200, false, `Enter a valid name for the product you want to upload`)
        }

        if (price != false) {
            if (price != getProductDetails.price) {
                dataObject.price = price
                dataChange = 1;
            }
        }


        if (category.length > 0 || subcategory.length > 0) {
            if (category != getProductDetails.category || subcategory != getProductDetails.subcategory) {
                let businessCategory = await this.BusinessCategory.addASingleCategoryOrSubcategory(businessId, category, subcategory)
                if (businessCategory.success == false) {
                    return this.returnData(businessCategory.code, false, businessCategory.message)
                } else {
                    dataObject.category = category
                    dataObject.subcategory = subcategory
                    dataChange = 1
                }
            }
        }

        if (dataChange == 0) {
            return this.returnData(200, false, 'No update was made. Update product details')
        }


        let basicDetailsUpdate = await this.findOneAndUpdate(productId, dataObject);

        if (basicDetailsUpdate.error == true) {
            return this.returnData(500, false, `An error occurred updating the product details for ${getProductDetails.name}`)
        }

        return this.returnData(202, true, `The product details for ${getProductDetails.name} was updated successfully`);

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
            if (businessData.result.owner._id != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null) return this.returnData(200, false, "This product does not exist");

        getProductDetails = getProductDetails.result;

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
            if (businessData.result.owner._id != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null) return this.returnData(200, false, "This product does not exist");

        getProductDetails = getProductDetails.result;
        
        tags = tags.map(x => this.MakeFirstLetterUpperCase(x))

        let mainTags = Array.from(new Set(tags))

        let tagObject = []

        for (let x of mainTags) {
            tagObject.push({tag_name: x})
        }

        if (getProductDetails.tags.length == 0) {

            let newTag = {tags: tagObject}
            let tagUpdate = await this.findOneAndUpdate(productId, newTag);

            if (tagUpdate.error == true) {
                return this.returnData(500, false, `An error occurred updating the tags for ${getProductDetails.name}`)
            }

            return this.returnData(202, true, `The tags for ${getProductDetails.name} was updated successfully`);
        }

       
        // update tag in db
        let newTag = {tags: tagObject}
        let tagUpdate = await this.findOneAndUpdate(productId, newTag);

        if (tagUpdate.error == true) {
            return this.returnData(500, false, `An error occurred updating the tags for ${getProductDetails.name}`)
        }

        return this.returnData(202, true, `The tags for ${getProductDetails.name} was updated successfully`);

        
    }

    async removeProductTag (tagId, productId, businessId, userId) {

        if (tagId.length < 1) return this.returnData(200, false, `Click on the tag you want to remove`)
        
        if (!productId || !businessId) return this.returnData(200, false, "Your business and product details were not provided. Kindly refresh the page and try again")
        
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

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null) return this.returnData(200, false, "This product does not exist");

        getProductDetails = getProductDetails.result
        
        let savedTags = getProductDetails.tags

        let check = 0;


        for (const [index, tag] of savedTags.entries()) {
            if (tagId == tag._id) {
                savedTags.splice(index, 1);
                check = 1
            }
        }

        if (check == 0) {
            return this.returnData(200, false, `The tag you are trying to remove, no longer exists`)
        }

        let newData = {tags: savedTags};
        let tagUpdate = await this.findOneAndUpdate(productId, newData);

        if (tagUpdate.error == true) {
            return this.returnData(500, false, `An error occurred removing your tag`)
        }

        return this.returnData(202, true, `Tag removed successfully`);
    }

    async createAvailableSizes (sizes, productId, businessId, userId) {

        if (sizes.length < 1) return this.returnAvailableSizes(200, false, "Enter one or multiple sizes seperated by comma for this product");

        if (!productId || !businessId) return this.returnAvailableSizes(200, false, "Your business and product details were not provided. Kindly refresh the page and try again")
        
        // check if business exists
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnAvailableSizes(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return this.returnAvailableSizes(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnAvailableSizes(200, false, "This product has been moved or does not exist.")
        
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.returnAvailableSizes(200, false, `This product does not exist`)

        getProductDetails = getProductDetails.result;

        sizes = sizes.map(x => this.MakeFirstLetterUpperCase(x))
        let mainSizes = Array.from(new Set(sizes))

        let newSizeArray = []

        for (let x of mainSizes) {
            newSizeArray.push({sizes: x})
        }

        if (getProductDetails.sizes.length == 0) {
            let newSizes = {sizes: newSizeArray}
            let sizeUpdate = await this.findOneAndUpdate(productId, newSizes);

            if (sizeUpdate.error == true) {
                return this.returnAvailableSizes(500, false, `An error occurred updating the sizes for ${getProductDetails.name}`)
            }


            let newSizeUpdate = [];
            for (let x of sizeUpdate.result.sizes) {
                newSizeUpdate.push({
                    sizeId: x._id,
                    sizeNumber: x.sizes
                })
            }
            
            return this.returnAvailableSizes(202, true, `The sizes for ${getProductDetails.name} was updated successfully`, newSizeUpdate);
        }
        

        // update sizes in db
        let newSizeObject = {sizes: newSizeArray}
        let sizeUpdate = await this.findOneAndUpdate(productId, newSizeObject);

        if (sizeUpdate.error == true) {
            return this.returnAvailableSizes(500, false, `An error occurred updating the sizes for ${getProductDetails.name}`)
        }
        
        let newSize = [];
        for (let y of sizeUpdate.result.sizes) {
            newSize.push({
                sizeId: y._id,
                sizeNumber: y.sizes
            })
        }
        return this.returnAvailableSizes(202, true, `The sizes for ${getProductDetails.name} was updated successfully`, newSize);

    }
    
    async removeProductSize (sizeId, productId, businessId, userId) {

        if (sizeId.length < 1) return this.returnData(200, false, `Click on the size you want to remove`)
        
        if (!productId || !businessId) return this.returnData(200, false, "Your business and product details were not provided. Kindly refresh the page and try again")
        
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

        let getProductDetails = await this.FindProductById(productId);
        
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.returnData(200, false, `This product does not exist`)

        getProductDetails = getProductDetails.result
        
        let savedSizes = getProductDetails.sizes

        let check = 0;

        for (const [index, size] of savedSizes.entries()) {
            if (sizeId == size._id) {
                savedSizes.splice(index, 1);

                // check changes
                check = 1;
            }
        }

        if (check == 0) {
            return this.returnData(200, true, `The size you are trying to remove, no longer exists.`);
        }

        let newData = {sizes: savedSizes};
        let sizeUpdate = await this.findOneAndUpdate(productId, newData);

        if (sizeUpdate.error == true) {
            return this.returnData(500, false, `An error occurred removing a product size`)
        }

        return this.returnData(202, true, `A product size was removed successfully`);

    }

    async createAvailableColors (colors, productId, businessId, userId) {
        
        if (colors.length < 1) return this.returnColorData(200, false, "Enter one or multiple colors seperated by comma");

        if (!productId || !businessId) return this.returnColorData(200, false, "Your business and product details were not provided. Kindly refresh the page and try again")
        
        // check if business exists
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnColorData(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return this.returnColorData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnColorData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.returnData(200, false, `This product does not exist`)

        getProductDetails = getProductDetails.result;

        colors = colors.map(x => this.MakeFirstLetterUpperCase(x))
        let mainColors = Array.from(new Set(colors))

        let newColorArray = []

        for (let x of mainColors) {
            newColorArray.push({color_codes: x})
        }

        if (getProductDetails.colors.length == 0) {

            let newColors = {colors: newColorArray}
            let colorUpdate = await this.findOneAndUpdate(productId, newColors);

            if (colorUpdate.error == true) {
                return this.returnColorData(500, false, `An error occurred updating the colors for ${getProductDetails.name}`)
            }

            let retrurnedColors = this.formatReturnedColor(colorUpdate.result.colors)

            return this.returnColorData(202, true, `The color for "${getProductDetails.name}" was created successfully`, retrurnedColors);
        }


        // update color in db
        let newColorObject = {colors: newColorArray}
        let colorUpdate = await this.findOneAndUpdate(productId, newColorObject);
        if (colorUpdate.error == true) {
            return this.returnData(500, false, `An error occurred updating the color for ${getProductDetails.name}`)
        }
        let retrurnedColors = this.formatReturnedColor(colorUpdate.result.colors)
        return this.returnColorData(202, true, `The colors for "${getProductDetails.name}" were updated successfully`, retrurnedColors);


    }
    
    async removeProductColor (colorId, productId, businessId, userId) {

        if (colorId.length < 1) return this.returnData(200, false, `Click on the color you want to remove`)
        
        if (!productId || !businessId) return this.returnData(200, false, "Your business and product details were not provided. Kindly refresh the page and try again")
        
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

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.returnData(200, false, `This product does not exist`)

        getProductDetails = getProductDetails.result
        
        let savedColor = getProductDetails.colors

        let check = 0;

        for (const [index, color] of savedColor.entries()) {
            if (colorId == color._id) {
                savedColor.splice(index, 1);

                // check changes
                check = 1;
            }
        }

        if (check == 0) {
            return this.returnData(200, false, `The color you are trying to remove, no longer exists.`);
        }

        let newData = {colors: savedColor};
        let colorUpdate = await this.findOneAndUpdate(productId, newData);

        if (colorUpdate.error == true) {
            return this.returnData(500, false, `An error occurred removing color`)
        }

        return this.returnData(202, true, `Color was removed successfully`);

    }

    async addMorePhotos(file, productId, businessId, userId) {


        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.uploadProductPhotoResponse(null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return this.uploadProductPhotoResponse(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.uploadProductPhotoResponse(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.uploadProductPhotoResponse(200, false, `This product does not exist`)

        getProductDetails = getProductDetails.result;

        // encrypt file name
        let encryptedName = this.encryptFileName(await this.generateId())
        let newFileName = encryptedName + "." + "jpg";

        //upload to cloudinary

        let folder = process.env.CLOUDINARY_FOLDER+"/business/"+businessId+"/product/";
        let publicId = encryptedName;
        let tag = 'product';

        let moveToCloud = await this.moveToCloudinary(folder, file, publicId, tag);

        if (moveToCloud.error == true) {
            return this.uploadProductPhotoResponse(null, 500, false, `An error uploading an image for ${getProductDetails.name}`)
        }

        let productImages = getProductDetails.images;
        productImages.push(newFileName);

        let newImageObject = {images: productImages};

        let imageUpdate = await this.findOneAndUpdate(productId, newImageObject);

        if (imageUpdate.error == true) {
            return this.returnData(500, false, `An error occurred uploading your image`)
        }

        return this.uploadProductPhotoResponse(202, true, `Image upload was successful`, productImages);

    }

    async makePrimaryImage(fileName, productId, businessId, userId) {
        if (fileName.length < 1) { 
            return { 
                images: null,
                code: 200,
                success: false,
                message: `Select the image you want to set as primary image`
            }
        }
        
        if (!productId || !businessId) {
            return {
                images: null,
                code: 200,
                success: false,
                message: `Your business and image details were not provided. Kindly refresh the page and try again`
            }
        }
        
        // check if business exists
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return {
                images: null,
                code: 200,
                success: false,
                message: 'Your business is not recognised.'
            }
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return {
                    image: null,
                    code: s200,
                    success: false,
                    message: 'You can not access this functionality. You do not own a business.'
                }
            }
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.returnData(200, false, `This product does not exist`)

        getProductDetails = getProductDetails.result;

        if (fileName == getProductDetails.primary_image) {
            return {
                images: null,
                code: 200,
                success: false,
                message: `This image is the primary image for ${getProductDetails.name}. Choose a different image`
            }
        }

        let imageArray = getProductDetails.images;

        let newArray = [fileName];

        newArray = newArray.concat(imageArray);

        let removeDuplicate =  Array.from(new Set(newArray))

        let newImageData = {
            primary_image: fileName,
            images: removeDuplicate
        }
        
        let imageUpdate = await this.findOneAndUpdate(productId, newImageData);

        if (imageUpdate.error == true) {
            return {
                images: null,
                code: 500,
                success: false,
                message: `An error occurred setting your the primary image for ${getProductDetails.name}.`
            }
        }
    
        return {
            images: removeDuplicate,
            code: 202,
            success: true,
            message: `The primary image for ${getProductDetails.name} was set`
        }

    }

    async removeProductImage (fileName, productId, businessId, userId) {

        if (fileName.length < 1) {
            return this.returnData(200, false, "Choose a photo you will like to delete")
        }

        if (!productId || !businessId) return this.returnData(200, false, "Your business and product details were not provided. Kindly refresh the page and try again")
        
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

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.returnData(200, false, `This product does not exist`)

        getProductDetails = getProductDetails.result;

        if (getProductDetails.images.length == 1) return this.returnData(200, false, `${getProductDetails.name} needs to have one photo. To delete this image, you need to upload one more image`)

        let newArray = [];
        let count = 0

        for (let image of getProductDetails.images) {
            if (image !== fileName) {
                newArray.push(image)
                count = 1
            }
        }

        if (count == 0) {
            return this.returnData(200, false, "The image you want to delete does not exist.")
        }

        let dataObject;

        if (fileName == getProductDetails.primary_image) {
            dataObject = {primary_image: newArray[0], images: newArray};
        } else {
            dataObject = {images: newArray}
        }
 
        
        // remove from db
        let imageUpdate = await this.findOneAndUpdate(productId, dataObject);
        let publicID = `${process.env.CLOUDINARY_FOLDER}/business/${businessId}/product/${fileName.split('.')[0]}`;
        
        // remove from cloudinary
        let removeFromCloudinary = await this.removeFromCloudinary(publicID, 'image') 
        
        
        if (imageUpdate.error) return this.returnData(500, false, "An error occurred while deleting your product image.")

        return this.returnData(202, true, `An image for ${getProductDetails.name} has been deleted successfully`)
        

    }
}
