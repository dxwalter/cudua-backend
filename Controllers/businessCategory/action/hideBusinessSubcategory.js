"use-strict";

const SubcategoryController = require('../../subcategories/SubcategoryController');
const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');

module.exports = class HideBusinessSubcategory extends SubcategoryController {
    constructor () {
        super();
        this.businessCategoryController = new BusinessCategoryController();
    }

    async hideSubcategory (businessId, categoryId, subcategoryId) {
    
        // note that documentI is the _id from business-category collection
        if (businessId.length < 1 || categoryId.length < 1, subcategoryId.length < 1) {
            return {
                code: 200, 
                success: false,
                message: "The right credential was not provided for this operation. Kindly refresh the page and try again"
            }
        }

        let hideMyBusinessSubcategory = await this.businessCategoryController.hideAndShowSubcategory(businessId, categoryId, subcategoryId, "hide");
        
        if (hideMyBusinessSubcategory.error == true) {
            return {
                code: 500,
                success: false,
                message: "An error occurred hiding your subcategory. This was caused by a wrong input or a broken program"
            }
        }

        if (hideMyBusinessSubcategory.error == false && hideMyBusinessSubcategory.result == false) {
            return {
                code: 200,
                success: false,
                message: "An error occurred hiding your subcategory and it was our fault. Please kindly retry the process"
            }
        }


        if (hideMyBusinessSubcategory.error == false && hideMyBusinessSubcategory.result == true) {

            return {
                code: 200,
                success: true,
                message: `Your subcategory was hidden successfully`
            }

        }

    }
}