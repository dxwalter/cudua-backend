'use-strict'

const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');
const BusinessController = require('../../business/BusinessController');
const ProductController = require('../../product/ProductController');
const CategoryController = require('../../product/ProductController');

module.exports = class DeleteSelectedCategory extends BusinessCategoryController {
    constructor () {
        super();
        this.businessController = new BusinessController();
        this.productController = new ProductController();
        this.categoryController = new CategoryController()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        };
    }

    async deleteCategory (categoryId, businessId) {

        // validation
        if (!categoryId || !businessId) return this.returnMethod(200, false, "The data required to perform this operation was not provided. Refresh page and try again")

        // select product
        let allProducts = await this.productController.allProductsInCategory(businessId, categoryId);

        if (allProducts.error) return this.returnMethod(500, false, "An error occurred from our end, kindly try again")
        
        if (allProducts.result.length > 0) {
            // delete images
            allProducts.result.forEach(product => {
                product.images.forEach(async image => {
                    let publicID = `cudua_commerce/business/${businessId}/product/${image.split('.')[0]}`;
                    await this.removeFromCloudinary(publicID, 'image')
                    
                })
            }); 
        }

        // delete products
        let deleteProducts = await this.productController.deleteAllProductsFromCategory(businessId, categoryId);
        if (deleteProducts.error) return this.returnMethod(500, false, "An error occurred from our end, kindly try again")

        // delete category
        let deleteChosenCategory = await this.deleteChoosenCategory(businessId, categoryId);
        if (deleteChosenCategory.error) return this.returnMethod(500, false, "An error occurred from our end, kindly try again")

        return this.returnMethod(200, true, "Category deleted successfully")
    }

}