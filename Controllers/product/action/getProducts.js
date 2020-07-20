'use-strict'

const ProductController = require('../ProductController');
const ProductReviewController = require('../../productReview/ProductReviewController');
const CategoryController = require('../../category/CategoryController');
const SubategoryController = require('../../subcategories/SubcategoryController');


module.exports = class EditProduct extends ProductController {

    constructor () {
        super();
        this.ProductReviewController = new ProductReviewController();
        this.CategoryController = new CategoryController();
        this.SubcategoryController = new SubategoryController();
    }

    returnData (product, code, success, message) {
        return {
            product: product,
            code: code,
            success: success,
            message: message
        }
    }

    returnProductSearchResult (product, code, success, message, count = 0) {
        return {
            products: product,
            resultCount: count,
            code: code,
            success: success,
            message: message
        }
    }

    returnMultipleData (product, code, success, message, count = 0) {
        return {
            products: product,
            totalProductsInCategoryCount: count,
            code: code,
            success: success,
            message: message
        }
    }

    returnMultipleDataFromSubcategory (product, code, success, message, count = 0) {
        return {
            products: product,
            totalProductsInSubcategoryCount: count,
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
                    authorId: review.author._id,
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

        for (const detail of details) {
            let data = {
                images: detail.images.length > 0 ? detail.images : null,
                colors: detail.colors.length > 0 ? [] : null,
                tags: detail.tags.length > 0 ? [] : null,
                sizes: detail.sizes.length > 0 ? [] : null,
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

            for (let color of detail.colors) {
                data.colors.push({
                    colorId: color._id,
                    color: color.color_codes
                })
            }

            for (let tag of detail.tags) {
                data.tags.push({
                    tagId: tag._id,
                    tagName: tag.tag_name
                })
            }

            for (let size of detail.sizes) {
                data.sizes.push({
                    sizeId: size._id,
                    sizeNumber: size.sizes
                })
            }

            productArray.push(data);
        }

        return productArray

    }

    async getProductById (productId) {

        if (productId.length < 1) return this.returnData(null, 200, false, `An error occurred. The details of the product was not provided`)

        let getProduct = await this.GetProductById(productId);

        if (getProduct.error ||  getProduct.result == null) return this.returnData(null, 500, false, `An error occurred. This product has been moved or deleted`)

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

    async businessGetProductBySubcategory (businessId, subcategoryId, page, userId) {

        if (page < 1) {
            return this.returnMultipleDataFromSubcategory(null, 200, false, `Set the page field for this request. The default value is 1`)
        }

        if (businessId.length == false || subcategoryId.length == false) {
            return this.returnMultipleDataFromSubcategory(null, 200, false, `An error occurred. Your business details or category details was not provided`)
        }

        // check if business exists
        let businessData = await this.getBusinessData (businessId);

        if (businessData.error == true) {
            return this.returnMultipleDataFromSubcategory(null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnMultipleDataFromSubcategory(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getSubategoryDetails = await this.SubcategoryController.GetOneSubcategory(subcategoryId)

        if (getSubategoryDetails.error == true) {
            return this.returnMultipleDataFromSubcategory(null, 500, false, `An error occurred. This subcategory has been deleted or does not exist`)
        }

        let subcategoryName = getSubategoryDetails.result.name;
        let categoryName = getSubategoryDetails.result.category_id.name;

        let getProducts = await this.GetBusinessProductsBySubcategory(businessId, subcategoryId, page);
        if (getProducts.error == true) {
            return this.returnMultipleDataFromSubcategory(null, 500, false, `An error occurred retrieving your products for ${subcategoryName} subcategory.`)
        }

        if (getProducts.result.products == null) {
            // check if no product has been added to this subcategory
            if (getProducts.result.totalNumberOfProducts == 0) {
                return this.returnMultipleDataFromSubcategory(null, 200, false, `No product has been added to ${subcategoryName} subcategory under ${categoryName} category.`)
            }

            return this.returnMultipleDataFromSubcategory(null, 200, false, `That was all the products in ${subcategoryName} subcategory.`, getProducts.result.totalNumberOfProducts)
        }


        let formatProduct = this.formatProductDetails(getProducts.result.products);

        return this.returnMultipleDataFromSubcategory(formatProduct, 200, true, `Products for ${subcategoryName} category successfully retrieved`, getProducts.result.totalNumberOfProducts)

    }

    async businessGetProductByCategory (businessId, categoryId, page, userId) {
        
        if (page < 1) {
            return this.returnMultipleData(null, 200, false, `Set the page field for this request. The default value is 1`)
        }

        if (businessId.length == false || categoryId.length == false) {
            return this.returnMultipleData(null, 200, false, `An error occurred. Your business details or category details was not provided`)
        }

        // check if business exists
        let businessData = await this.getBusinessData (businessId);

        if (businessData.error == true) {
            return this.returnMultipleData(null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnMultipleData(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getCategoryDetails = await this.CategoryController.GetOneCategory(categoryId)

        if (getCategoryDetails.error == true) {
            return this.returnMultipleData(null, 500, false, `An error occurred. This category has been deleted or does not exist.`)
        }

        let categoryName = getCategoryDetails.result.name;

        let getProducts = await this.GetBusinessProductsByCategory(businessId, categoryId, page);
        if (getProducts.error == true) {
            return this.returnMultipleData(null, 500, false, `An error occurred retrieving your products for ${categoryName} category.`)
        }

        if (getProducts.result.products == null) {
            
            // check if no product has been added to this subcategory
            if (getProducts.result.totalNumberOfProducts == 0) {
                return this.returnMultipleData(null, 200, false, `No product has been added to ${categoryName} category.`)
            }

            return this.returnMultipleData(null, 200, false, `That was all the products in ${categoryName} category.`, getProducts.result.totalNumberOfProducts)
        }


        let formatProduct = this.formatProductDetails(getProducts.result.products);

        return this.returnMultipleData(formatProduct, 200, true, `Products for ${categoryName} category successfully retrieved`, getProducts.result.totalNumberOfProducts)

    }

    async SearchForBusinessProduct (businessId, keyword, userId) {

        if (businessId.length == false || keyword.length == false) {
            return this.returnProductSearchResult(null, 200, false, `An error occurred. Your business details or search keyword was not provided`)
        }

        // check if business exists
        let businessData = await this.getBusinessData (businessId);

        if (businessData.error == true) {
            return this.returnProductSearchResult(null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnProductSearchResult(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let productSearch = await this.businessProductSearch(businessId, keyword);

        if (productSearch.error == true) {
            return this.returnProductSearchResult(null, 500, false, `An error occurred while searching for '${keyword}'.`)
        }

        if (productSearch.result.products == null) {
            
            // check if no product has been added to this subcategory
            if (productSearch.result.totalNumberOfProducts == 0) {
                return this.returnProductSearchResult(null, 200, false, `No result was found for '${keyword}'.`)
            }
        }


        let formatProduct = this.formatProductDetails(productSearch.result.products);

        return this.returnProductSearchResult(formatProduct, 200, true, `Product search was successful`, productSearch.result.totalNumberOfProducts)


        
    }
}