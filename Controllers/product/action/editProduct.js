'use-strict'

const ProductModel = require('../../../Models/Product');
const ProductController = require('../ProductController');
const createBusinessCategory = require('../../businessCategory/action/createBusinessCategories');
const Categories = require('../../../Models/Categories');


module.exports = class EditProduct extends ProductController {

    constructor () {
        super();
        this.BusinessCategory = new createBusinessCategory();
        this.businessProductPath = 'uploads/product/';
    }

    returnData (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
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
            if (businessData.result.owner != userId) {
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
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null) return this.returnData(200, false, "This product does not exist");

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
            if (businessData.result.owner != userId) {
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

        if (sizes.length < 1) return this.returnData(200, false, "Enter one or multiple sizes seperated by comma for this product");

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
        
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.returnData(200, false, `This product does not exist`)

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
                return this.returnData(500, false, `An error occurred updating the sizes for ${getProductDetails.name}`)
            }

            return this.returnData(202, true, `The sizes for ${getProductDetails.name} was updated successfully`);
        }
        

        // update sizes in db
        let newSizeObject = {sizes: newSizeArray}
        let sizeUpdate = await this.findOneAndUpdate(productId, newSizeObject);

        if (sizeUpdate.error == true) {
            return this.returnData(500, false, `An error occurred updating the sizes for ${getProductDetails.name}`)
        }

        return this.returnData(202, true, `The sizes for ${getProductDetails.name} was updated successfully`);

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
            if (businessData.result.owner != userId) {
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
        
        if (colors.length < 1) return this.returnData(200, false, "Enter one or multiple colors to add to this product");

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
                return this.returnData(500, false, `An error occurred updating the colors for ${getProductDetails.name}`)
            }

            return this.returnData(202, true, `The color for ${getProductDetails.name} was updated successfully`);
        }


        // update color in db
        let newColorObject = {colors: newColorArray}
        let colorUpdate = await this.findOneAndUpdate(productId, newColorObject);

        if (colorUpdate.error == true) {
            return this.returnData(500, false, `An error occurred updating the color for ${getProductDetails.name}`)
        }

        return this.returnData(202, true, `The color for ${getProductDetails.name} were updated successfully`);


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
            if (businessData.result.owner != userId) {
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
            return this.returnData(200, true, `The color you are trying to remove, no longer exists.`);
        }

        let newData = {colors: savedColor};
        let colorUpdate = await this.findOneAndUpdate(productId, newData);

        if (colorUpdate.error == true) {
            return this.returnData(500, false, `An error occurred removing color`)
        }

        return this.returnData(202, true, `Color was removed successfully`);

    }

    async addMorePhotos(file, productId, businessId, userId) {

        const { filename, mimetype, createReadStream } = await file;

        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        if (filename.length < 1) {
            return this.returnData(200, false, "Choose a photo to upload for" + " " + getProductDetails.name)
        }

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error == true) return this.returnData(200, false, "This product has been moved or does not exist.")
        if (getProductDetails.result == null || getProductDetails.result.business_id != businessId) return this.returnData(200, false, `This product does not exist`)

        getProductDetails = getProductDetails.result;

        // encrypt file name
        let encryptedName = this.encryptFileName(filename)
        let newFileName = encryptedName + "." + mimetype.split('/')[1];
        const stream = createReadStream();

        const pathObj = await this.uploadImageFile(stream, newFileName, this.businessProductPath);

        if (pathObj.error == true) {
            return this.returnData(null, 500, false, "An error occurred uploading your product photo. Please try again")
        }

        //upload to cloudinary

        let folder = "cudua_commerce/business/"+businessId+"/product/";
        let publicId = encryptedName;
        let tag = 'product';
        let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

        let deleteFile = await this.deleteFileFromFolder(imagePath)

        if (moveToCloud.error == true) {
            return this.returnData(null, 500, false, `An error uploading an image for ${getProductDetails.name}`)
        }

        let productImages = getProductDetails.images;
        productImages.push(newFileName);

        let newImageObject = {images: productImages};

        let imageUpdate = await this.findOneAndUpdate(productId, newImageObject);

        if (imageUpdate.error == true) {
            return this.returnData(500, false, `An error occurred uploading your image`)
        }

        return this.returnData(202, true, `Image upload was successful`);

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
            if (businessData.result.owner != userId) {
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
            if (businessData.result.owner != userId) {
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
        let publicID = `cudua_commerce/business/${businessId}/product/${fileName.split('.')[0]}`;
        
        // remove from cloudinary
        let removeFromCloudinary = await this.removeFromCloudinary(publicID, 'image') 
        
        
        if (imageUpdate.error) return this.returnData(500, false, "An error occurred while deleting your product image.")

        return this.returnData(202, true, `An image for ${getProductDetails.name} has been deleted successfully`)
        

    }
}
