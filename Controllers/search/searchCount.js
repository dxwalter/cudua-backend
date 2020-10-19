
const ProductController = require('../product/ProductController')
const BusinessController = require('../business/BusinessController')

module.exports = class RegularSearchCount {
    constructor () {
        this.ProductController = new ProductController();
        this.BusinessController = new BusinessController();
    }

    returnMethod (products, businesses, code, success, message) {
        return {
            products: products,
            businesses: businesses,
            code: code,
            success: success,
            message: message
        }
    }

    async RunSearchCount (keyword) {
        if (keyword.length < 1) return this.returnMethod(null, null, 500, false, "You did not provide a search string");

        let productCount = await this.ProductController.productSearchCount(keyword);

        let businessCount = await this.BusinessController.businessSearchCount(keyword)

        return this.returnMethod(productCount, businessCount, 200, true, "Search complete")
    }

}