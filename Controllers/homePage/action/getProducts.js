'use-strict'

const ProductController = require('../../product/ProductController');

module.exports = class HomePageGetProducts extends ProductController {
    constructor () {
        super();
        this.page = 1
        this.certifiedProducts = [];
    }

    returnMethod (products, code, success, message) {
        return {
            products: products,
            code: code,
            success: success,
            message: message
        }
    }

    async validateProduct (data) {

    }


    async getNewProducts () {
        
        let getProductsForHomePage = await this.homePageProducts(this.page)

        if (getProductsForHomePage.error) return this.returnMethod(null, 500, false, "An error occurred. Please try again")

        let data = getProductsForHomePage.result

        if (data.length == 0) return this.returnMethod(this.certifiedProducts, 200, true, "No product to be shown");

        for( let productData of data) {
            if (productData.business_id != null) {
                if (productData.business_id.subscription_status == 0) {
                    // if subscription_status == 0, subscription active
                    let contact = productData.business_id.contact == null ? [] : productData.business_id.contact.phone
                    // if (contact.length > 0) {
                        this.certifiedProducts.push({
                            image: productData.primary_image,
                            productId: productData.id,
                            businessId: productData.business_id.id,
                            name: productData.name,
                            price: productData.price
                        })
                    // }
                }
            }
        }

        if (this.certifiedProducts.length < 30 && data.length > 0) {
            this.page = this.page + 1;
            this.getNewProducts();
        }

        return this.returnMethod(this.certifiedProducts, 200, true, "Products retrieved");

    }
}