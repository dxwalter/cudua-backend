'use-strict'

const ProductController = require('../ProductController');
const ProductReviewController = require('../../productReview/ProductReviewController');
const CategoryController = require('../../category/CategoryController');
const SubategoryController = require('../../subcategories/SubcategoryController');
const FormatBusinessData = require('../../business/action/getBusinessData');
const BusinessCatgories = require('../../businessCategory/BusinessCategoryController')


module.exports = class EditProduct extends ProductController {

    constructor () {
        super();
        this.ProductReviewController = new ProductReviewController();
        this.CategoryController = new CategoryController();
        this.SubcategoryController = new SubategoryController();
        this.formatBusinessData = new FormatBusinessData()
        this.BusinessCatgories = new BusinessCatgories()
    }

    returnData (product, code, success, message, business = null) {
        return {
            product: product,
            code: code,
            success: success,
            message: message,
            business: business
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
                    displayPicture: review.author.profilePicture
                },
                rating: review.rating,
                description: review.description,
                timeStamp: review.created
            }

            newReviewArray.push(data)
        }

        return newReviewArray

    }

    formatProductDetails (details) {

        let productArray = []

        for (const detail of details) {
            let data = {
                images: detail.images.length > 0 ? detail.images : [],
                colors: detail.colors.length > 0 ? [] : [],
                tags: detail.tags.length > 0 ? [] : [],
                sizes: detail.sizes.length > 0 ? [] : [],
                id: detail._id,
                name: detail.name,
                price: detail.price,
                hide: detail.hide,
                businessId: detail.business_id.id,
                reviewScore: detail.score,
                description: detail.description,
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

        if (productDetails.hide == 1) return this.returnData(null, 500, false, `An error occurred. This product has been moved or deleted`)

        let getProductReview = await this.ProductReviewController.getReviewByProductId(productId);

        let reviews;

        if (getProductReview.error == false) {
            reviews = getProductReview.result.length > 0 ? this.formatReview(getProductReview.result) : [];
        } else {
            reviews = []
        }

        let formatProduct = this.formatProductDetails([productDetails]);
        let formatBusinessDetails = await this.formatBusinessData.formatBusinessDetails(productDetails.business_id, null);


        formatProduct[0].reviews = reviews

        return this.returnData(formatProduct[0], 200, true, `Product successfully retrieved`, formatBusinessDetails)
        
    }

    async businessGetProductById (productId) {

        if (productId.length < 1) return this.returnData(null, 200, false, `An error occurred. The details of the product was not provided`)

        let getProduct = await this.GetProductById(productId);

        if (getProduct.error ||  getProduct.result == null) return this.returnData(null, 500, false, `An error occurred. This product has been moved or deleted`)

        let productDetails = getProduct.result

        let getProductReview = await this.ProductReviewController.getReviewByProductId(productId);

        let reviews;

        if (getProductReview.error == false) {
            reviews = getProductReview.result.length > 0 ? this.formatReview(getProductReview.result) : [];
        } else {
            reviews = []
        }

        let formatProduct = this.formatProductDetails([productDetails]);
        let formatBusinessDetails = await this.formatBusinessData.formatBusinessDetails(productDetails.business_id, null);


        formatProduct[0].reviews = reviews

        return this.returnData(formatProduct[0], 200, true, `Product successfully retrieved`, formatBusinessDetails)
        
    }

    async BusinessGetProductBySubcategory (businessId, subcategoryId, page) {

        if (page < 1) {
            return this.returnMultipleDataFromSubcategory(null, 200, false, `Set the page field for this request. The default value is 1`)
        }

        if (businessId.length == false || subcategoryId.length == false) {
            return this.returnMultipleDataFromSubcategory(null, 200, false, `An error occurred. The business details or subcategory details was not provided`)
        }

        // check if business exists
        let businessData = await this.getBusinessData (businessId);

        if (businessData.error == true) {
            return this.returnMultipleDataFromSubcategory(null, 200, false, "This business is not recognised.")
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

        if (getProducts.result == null) {
            return this.returnMultipleDataFromSubcategory(null, 200, true, `That was all the products in ${subcategoryName} subcategory.`, getProducts.result.totalNumberOfProducts)
        }


        let formatProduct = this.formatProductDetails(getProducts.result);

        return this.returnMultipleDataFromSubcategory(formatProduct, 200, true, `Products for ${subcategoryName} category successfully retrieved`, getProducts.result.totalNumberOfProducts)

    }

    async BusinessGetProductByCategory (businessId, categoryId, page) {
        
        if (page < 1) {
            return this.returnMultipleData(null, 200, false, `Set the page field for this request. The default value is 1`)
        }

        if (businessId.length == false || categoryId.length == false) {
            return this.returnMultipleData(null, 200, false, `An error occurred. Your business details or category details was not provided`)
        }

        // check if business exists
        let businessData = await this.getBusinessData (businessId);

        if (businessData.error == true) {
            return this.returnMultipleData(null, 200, false, "This business is not recognised.")
        }

        let getCategoryDetails = await this.CategoryController.GetOneCategory(categoryId)

        if (getCategoryDetails.error == true) {
            return this.returnMultipleData(null, 500, false, `An error occurred. This category has been deleted or does not exist.`)
        }

        let categoryName = getCategoryDetails.result.name;

        let getProducts = await this.GetBusinessProductsByCategory(businessId, categoryId, page);
        if (getProducts.error == true) {
            return this.returnMultipleData(null, 500, false, `An error occurred retrieving the products for ${categoryName} category.`)
        }

        if (getProducts.result == null) {
            return this.returnMultipleData(null, 200, true, `No product has been added to ${categoryName} category.`)
        }

        let formatProduct = this.formatProductDetails(getProducts.result);

        return this.returnMultipleData(formatProduct, 200, true, `Products for ${categoryName} category successfully retrieved`, getProducts.result.totalNumberOfProducts)

    }

    async getProductByBusinessId (businessId, page = 1) {
        
        if (businessId.length < 1) return this.returnMultipleDataFromSubcategory(null, 200, false, "This business does not exist. It has either been moved or deleted");

        // check if business exists
        let businessData = await this.getBusinessData (businessId);

        if (businessData.error == true) {
            return this.returnMultipleDataFromSubcategory(null, 200, false, "This business does not exist. It has either been moved or deleted")
        }
        
        let query = await this.FindProductByBusinessId(businessId, page);

        if (query.error) return this.returnMultipleDataFromSubcategory(null, 500, false, "An error occurred from our end. Kindly refresh the page and try again");
    

        if (query.result.length == null) return this.returnMultipleDataFromSubcategory(null, 200, true, "No product has been uploaded by this business");

        let formatProduct = this.formatProductDetails(query.result);

        return this.returnMultipleDataFromSubcategory(formatProduct, 200, true, "successful")

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
            if (businessData.result.owner._id != userId) {
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
                return this.returnProductSearchResult(null, 200, true, `No result was found for '${keyword}'.`)
            }
        }


        let formatProduct = this.formatProductDetails(productSearch.result.products);

        return this.returnProductSearchResult(formatProduct, 200, true, `Product search was successful`, productSearch.result.totalNumberOfProducts)


        
    }

    async SearchForBusinessProductByCustomer (businessId, keyword, page = 1) {

        page = page == 0 ? 1 : page

        if (businessId.length == false || keyword.length == false) {
            return this.returnProductSearchResult(null, 200, false, `An error occurred. Your business details or search keyword was not provided`)
        }

        // check if business exists
        let businessData = await this.getBusinessData (businessId);

        if (businessData.error == true) {
            return this.returnProductSearchResult(null, 200, false, "This business is not recognised.")
        }

        let productSearch = await this.businessProductSearchCustomer(businessId, keyword, page);

        if (productSearch.error == true) {
            return this.returnProductSearchResult(null, 500, false, `An error occurred while searching for '${keyword}'.`)
        }

        if (productSearch.result.products == null) {
            if (page > 1){
                return this.returnProductSearchResult(null, 200, true, `That was all the results for '${keyword}'.`, productSearch.result.totalNumberOfProducts)
            } else {
                return this.returnProductSearchResult(null, 200, true, `No result was found for '${keyword}'.`, productSearch.result.totalNumberOfProducts)
            }
        }

        let formatProduct = this.formatProductDetails(productSearch.result.products);

        return this.returnProductSearchResult(formatProduct, 200, true, `Product search was successful`, productSearch.result.totalNumberOfProducts)

    }

    async getProductSuggestions(businessId, productId) {

        if (businessId.length == 0 || productId.length == 0) return this.returnMultipleDataFromSubcategory([], 500, false, "Incomplete data");

        let getProductDetails = await this.FindProductById(productId);

        if (getProductDetails.error) return this.returnMultipleDataFromSubcategory([], 500, false, getProductDetails.message);

        let categoryId = getProductDetails.result.category
        let subcategoryId = getProductDetails.result.subcategory

        // get business product categories
        let getBusinessCategories = await this.BusinessCatgories.getbusinessCategories(businessId);

        if (getBusinessCategories.error) return this.returnMultipleDataFromSubcategory([], 500, false, getBusinessCategories.message);

        let scoreOne = [];
        
        let scoreTwo = [];

        let scoreThree = [];


        let allCategories = getBusinessCategories.result

        if (allCategories.length == 0) return this.returnMultipleDataFromSubcategory([], 200, false, "This business has no category")

        let visibleSubCategories = [];

        for (let allCat of allCategories) {
            if (allCat.hide == 0) {
                for (let subcat of allCat.subcategories) {
                    if (subcat.hide == 0) {
                        visibleSubCategories.push(subcat.subcategory_id._id);
                    }
                }
            }
        }

        // get products from subcategory
        
        for (let ids of visibleSubCategories) {

            let getProductFromSubcatgory = await this.GetBusinessProductsBySubcategory(businessId, ids, 1);
            if (getProductFromSubcatgory.error == false) {

                let productCount = 0

                if (ids.toString() == subcategoryId) {
                    for (let product of getProductFromSubcatgory.result) {
                        if (product.hide == 0 && product.id != productId) {
                            productCount = scoreOne.length + scoreTwo.length
                            if (productCount >= 10) break;
                            scoreOne.push(product)
                        } 
                    }
                } else {
                    for (let product of getProductFromSubcatgory.result) {
                        if (product.hide == 0 && product.id != productId) {
                            productCount = scoreOne.length + scoreTwo.length
                            if (productCount >= 10) break;
                            scoreTwo.push(product)
                        } 
                    }
                }
            }
        }

        
        let mergeArray = [...scoreOne, ...scoreTwo];

        let formatProduct = this.formatProductDetails(mergeArray)

        return this.returnMultipleDataFromSubcategory(formatProduct, 200, true, "successful")
        

    }

    async GetAllProductsByCategory (categoryId, page = 1) {

        page = page > 0 ? page : 1
        
        if (categoryId.length < 1) {
            return this.returnMultipleDataFromSubcategory([], 500, false, "Your category of choice was not provided")
        }

        let getAllProductsInCategory = await this.CustomerGetAllProductsByCategory(categoryId, page)

        if (getAllProductsInCategory.error == true) {
            return this.returnMultipleDataFromSubcategory([], 500, false, `An error occurred from our end. Kindly try again.`)
        }

        if (getAllProductsInCategory.result == null || getAllProductsInCategory.result.length == 0) {

            let message = page > 1 ? "That was all the products in this category" : `No product was found for this category.`;
            
            return this.returnMultipleDataFromSubcategory([], 200, true, message)
        }


        let formatProduct = this.formatProductDetails(getAllProductsInCategory.result);

        return this.returnMultipleDataFromSubcategory(formatProduct, 200, true, `Products retrieved.`)

    }

    async GetAllProductsBySubcategory (subcategoryId, page = 1) {

        page = page > 0 ? page : 1

        if (subcategoryId.length < 1) {
            return this.returnMultipleDataFromSubcategory([], 500, false, "Your subcategory of choice was not provided")
        }

        let getAllProductsInSubcategory = await this.CustomerGetAllProductsBySubcategory(subcategoryId, page)

        if (getAllProductsInSubcategory.error == true) {
            return this.returnMultipleDataFromSubcategory([], 500, false, `An error occurred from our end. Kindly try again.`)
        }

        if (getAllProductsInSubcategory.result == null || getAllProductsInSubcategory.result.length == 0) {
            
            let message = page > 1 ? "That was all the products in this subcategory" : `No product was found for this subcategory.`;

            return this.returnMultipleDataFromSubcategory([], 200, true, message)
        }


        let formatProduct = this.formatProductDetails(getAllProductsInSubcategory.result);

        return this.returnMultipleDataFromSubcategory(formatProduct, 200, true, `Products retrieved.`)
    }

}