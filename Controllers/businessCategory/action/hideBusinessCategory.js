"use-strict";

let BusinessCategoryController = require('../BusinessCategoryController');
let BusinessCategoryModel = require('../../../Models/BusinessCategory');

const CategoryController = require('../../category/CategoryController');
const SubcategoryController = require('../../subcategories/SubcategoryController');

module.exports = class HideBusinessCategory extends BusinessCategoryController {
    constructor () {
        super();
        this.CategoryController = new CategoryController()
    }

    async hideCategory (categoryId, businessId) {
        // note that documentId is the _id from business-category collection
        if (categoryId.length < 1 || businessId.length < 1) {
            return {
                code: 200, 
                success: false,
                message: "The right credential was not provided for this operation. Kindly refresh the page and try again"
            }
        }

        let hideMyBusinesscategory = await this.updateChoosenCategory(businessId, categoryId, {hide: 1});
        if (hideMyBusinesscategory.error == true) {
            return {
                code: 500,
                success: false,
                message: "An error occurred hiding your category and it was our fault. Please kindly retry the process"
            }
        }

        if (hideMyBusinesscategory.error == false && hideMyBusinesscategory.result == false) {
            return {
                code: 500,
                success: false,
                message: "No category was found associated with this account. Kindly refresh the page and try again"
            }
        }

        let getCategoryDetails = await this.CategoryController.GetOneCategory(categoryId);

        if (getCategoryDetails.error == true) {
            return {
                code: 200,
                success: true,
                message: "Your category was hidden successfully"
            }
        }

        let categoryName = getCategoryDetails.result.name;

        return {
            code: 200,
            success: true,
            message: `${categoryName} category is no longer visible to customers`
        }

    }
}