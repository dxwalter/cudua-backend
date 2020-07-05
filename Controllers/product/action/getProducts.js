const ProductModel = require('../../../Models/Product');
const ProductController = require('../ProductController');
const ProductReviewController = require('../../productReview/ProductReviewController');


module.exports = class EditProduct extends ProductController {

    constructor () {
        super();
        this.ProductReviewController = new ProductReviewController();
    }

    returnData (product, code, success, message) {
        return {
            product: product,
            code: code,
            success: success,
            message: message
        }
    }

    formatReview (reviewArray) {

        let newReviewArray = [];

        for (let review of reviewArray) {
            let data = {
                author: {
                    fullname: review.author.fullname,
                    profilePicture: review.author.profilePicture
                },
                rating: review.rating,
                description: review.description
            }

            newReviewArray.push(data)
        }

        return newReviewArray

    }

    formatProductDetails (details) {

        let productArray = [];

        for (let detail of details) {
            let data = {
                images: detail.images.length > 0 ? detail.images : null,
                colors: detail.colors.length > 0 ? detail.colors : null,
                tags: detail.tags.length > 0 ? detail.tags : null,
                id: detail._id,
                name: detail.name,
                price: detail.price,
                hide: detail.hide,
                reviewScore: detail.score,
                category: {
                    categoryId: detail.category._id,
                    categoryName: detail.category.name
                },
                subcategory: {
                    subcategoryId: detail.subcategory._id,
                    subcategoryName: detail.subcategory.name,
                },
                primaryImage: detail.primary_image
            }
            productArray.push(data);
        }

        return productArray;

    }

    async getProductById (productId) {

        if (productId.length < 1) return this.returnData(null, 200, false, `An error occurred. The ID of the product was not provided`)

        let getProduct = await this.GetProductById(productId);

        if (getProduct.error) return this.returnData(null, 500, false, `An error occurred. This product has been moved or deleted`)

        let productDetails = getProduct.result

        let getProductReview = await this.ProductReviewController.getReviewByProductId(productId);

        let reviews;

        if (getProductReview.error == false) {
            reviews = getProductReview.result.length > 0 ? this.formatReview(getProductReview.result) : null;
        } else {
            reviews = null
        }

        let formatProduct = this.formatProductDetails([productDetails]);

        formatProduct[0].reviews = reviews

        return this.returnData(formatProduct[0], 200, true, `Product successfully retrieved`)
        
    }

    
}