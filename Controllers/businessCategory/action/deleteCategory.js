'use-strict'

const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');
const BusinessController = require('../../business/BusinessController');
const ProductController = require('../../product/ProductController');

module.exports = class DeleteSelectedCategory extends BusinessCategoryController {
    constructor () {
        super();
        this.businessController = new BusinessController();
        this.productController = new ProductController();
    }

    async deleteCategory (categoryId, businessId) {
        console.log(categoryId)
        console.log(businessId)

        return {
            code: 200,
            success: true,
            message: "Category deleted successfully"
        };
    }

}