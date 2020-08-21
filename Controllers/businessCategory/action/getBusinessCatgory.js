'use-strict'

const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');
const BusinessController = require('../../business/BusinessController');
const ProductController = require('../../product/ProductController');

module.exports = class GetBusinessCategories extends BusinessCategoryController {
    constructor () {
        super();
        this.businessController = new BusinessController();
        this.productController = new ProductController();
    }

    async getBusinessCategoriesAndSubcategoriesWithCount (businessId, userId) {
        
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getBusinessCategories = await this.getbusinessCategories(businessId);

        if (getBusinessCategories.error == true) {
            return {
                businessCategory: null,
                code: 500, 
                success: false,
                message: 'An error occurred retrieving your business categories and subcategories'
            }
        }

        if (getBusinessCategories.result < 1) {
            return {
                businessCategory: null,
                code: 200, 
                success: true,
                message: 'No business category or subcategory has been added to your business'
            }
        }

        let categories = getBusinessCategories.result

        let categoriesArray = [];

        for (let [index, categoryData] of categories.entries()) {

            let catData = categoryData.category_id;
            categoriesArray[index] = {
                itemId: categoryData._id, // this is not the category id
                hide: categoryData.hide,

                categoryId: catData._id,
                categoryName: catData.name,
                subcategory: []
            }

            
            for (let [subcatIndex, subcat] of categoryData.subcategories.entries()) {
                let subcatData = subcat.subcategory_id

                categoriesArray[index].subcategory[subcatIndex] = {
                    hide: subcat.hide,
                    itemId: subcat._id, // this is not this subcategories array
                    subcategoryId: subcatData._id,
                    subcategoryName: subcatData.name,
                    subcategoryProductCount: await this.productController.countBusinessProducts({business_id: businessId, subcategory: subcatData._id.toString()})
                }
            }

            categoriesArray[index].subcategory = this.SortSubcategories(categoriesArray[index].subcategory)

        }


        return {
            businessCategory: this.SortCategories(categoriesArray),
            code: 200, 
            success: true,
            message: 'Your business categories and sucategories were retrieved successfully'
        }

    }
}