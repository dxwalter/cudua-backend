'use-strict'

const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');
const BusinessController = require('../../business/BusinessController');
const ProductController = require('../../product/ProductController');

module.exports = class DeleteSelectedSubcategory extends BusinessCategoryController {
    constructor () {
        super();
        this.businessController = new BusinessController();
        this.productController = new ProductController();
    }

    async deleteSubcategory (subcategoryId, businessId) {
        console.log(subcategoryId)
        console.log(businessId)

        return {
            code: 200,
            success: true,
            message: "Category deleted successfully"
        };
    }

}