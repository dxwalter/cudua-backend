'use-strict'

const ProductModel = require('../../Models/Product')
const BusinessModel = require('../../Models/BusinessModel')
const BusinessController = require('../business/BusinessController')

module.exports = class ProductController extends BusinessController {

    async countAllProductsInCudua () {
        try {
            let countResult = await ProductModel.countDocuments();
            return countResult
        } catch (error) {
            return 0;
        }
    }

    async InsertNewProduct (newProduct) {
        
        try {
            const create = await newProduct.save();
            return {
                error: false,
                result: create
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async FindProductById (productId) {
        try {
            const findProduct = await ProductModel.findOne({_id: productId}).exec();

            return {
                result: findProduct,
                error: false
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async GetProductById (productId) {
        try {
            
            const findProduct = await ProductModel.findOne({_id: productId})
            .populate('category')
            .populate('subcategory')
            .populate('business_id')
            .exec();

            return {
                error: false,
                result: findProduct
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async countBusinessProducts (dataObject) {
        try {
            let countResult = await ProductModel.countDocuments({$and : [dataObject]});
            return countResult
        } catch (error) {
            return 0;
        }
    }

    async GetBusinessProductsByCategory(businessId, categoryId, page) {

        try {

            // total number of returned products per request
            let limit = 12;

            let getProducts = await ProductModel.find({
                $and: [
                    {
                        category: categoryId,
                        business_id: businessId
                    }
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category')
            .populate('subcategory')
            .populate('business_id')
        
            return {
                error: false,
                result: getProducts
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }

    }

    async FindProductByBusinessId(businessId, page) {

        try {

            // total number of returned products per request
            let limit = 12;

            let getProducts = await ProductModel.find({business_id: businessId})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category')
            .populate('subcategory')

            return {
                error: false,
                result: getProducts
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }

    }
    
    async GetBusinessProductsBySubcategory(businessId, subcategoryId, page) {

        try {

            // total number of returned products per request
            let limit = 12;

            let getProducts = await ProductModel.find({
                $and: [
                    {
                        subcategory: subcategoryId,
                        business_id: businessId
                    }
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category')
            .populate('subcategory')
            .populate('business_id')

            

            return {
                error: false,
                result: getProducts
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }

    }
    
    async businessProductSearch(businessId, keyword) {

        try {

            // total number of returned products per request

            let getProducts = await ProductModel
            .find({
                $and: [
                    {
                        name: { $regex: '.*' + keyword + '.*', $options: 'i'}, 
                        business_id: businessId
                    }
                ]
            })
            .populate('category')
            .populate('subcategory')
            .limit(4)

            let result = {
                totalNumberOfProducts: getProducts.length,
                products: getProducts.length > 0 ? getProducts : null
            }

            return {
                error: false,
                result: result
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }

    }

    async businessProductSearchCustomer(businessId, keyword, page) {

        try {

            let limit = 12

            // total number of returned products per request

            let getProducts = await ProductModel
            .find({
                $and: [
                    {
                        name: { $regex: '.*' + keyword + '.*', $options: 'i'}, 
                        business_id: businessId,
                        hide: 0
                    }
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)

            let result = {
                totalNumberOfProducts: await ProductModel
                .countDocuments({
                    $and: [
                        {
                            name: { $regex: '.*' + keyword + '.*', $options: 'i'}, 
                            business_id: businessId,
                            hide: 0
                        }
                    ]
                }),
                products: getProducts.length > 0 ? getProducts : null
            }

            

            return {
                error: false,
                result: result
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }

    }

    async findOneAndUpdate(productId, newDataObject) {
        try {
            let updateRecord = await ProductModel.findOneAndUpdate({_id: productId}, { $set:newDataObject }, {new : true });
            return {
                error: false,
                result: updateRecord
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async allProductsInSubcategory (businessId, subcategoryId) {

        try {

            let getProducts = await ProductModel.find({$and: [{business_id: businessId, subcategory: subcategoryId}]})

            return {
                error: false,
                result: getProducts
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }

    }

    async allProductsInCategory (businessId, categoryId) {

        try {

            let getProducts = await ProductModel.find({$and: [{business_id: businessId, category_id: categoryId}]})

            return {
                error: false,
                result: getProducts
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }

    }

    async deleteAllProductsFromSubcategory(businessId, subcategoryId) {
        try {
            
            let deleteItem = await ProductModel.deleteMany({    
                $and: [{business_id: businessId, subcategory: subcategoryId}]
            })

            if (deleteItem.ok == 1) {
                return {
                    result: true,
                    error: false
                }
            } else {
                return {
                    result: false,
                    error: false
                }
            }
           
        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }

    async deleteAllProductsFromCategory(businessId, categoryId) {
        try {
            
            let deleteItem = await ProductModel.deleteMany({    
                $and: [{business_id: businessId, category: categoryId}]
            })

            if (deleteItem.ok == 1) {
                return {
                    result: true,
                    error: false
                }
            } else {
                return {
                    result: false,
                    error: false
                }
            }
           
        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }

    async deleteProductById(productId, businessId) {
        
        try {
            let deleteItem = await ProductModel.deleteOne({
                $and: [{_id: productId, business_id: businessId}]    
            });

            if (deleteItem.ok == 1) {
                return {
                    result: true,
                    error: false
                }
            } else {
                return {
                    result: false,
                    error: false
                }
            }

        } catch (error) {
            
            return {
                message: error.message,
                error: true
            }

        }

    }

    async RegularProductSearch(keyword, page) {

        try {

            let limit = 50
            
            let getProducts = await ProductModel
            .find({
                $and: [
                    {
                        name: { $regex: '.*' + keyword + '.*', $options: 'i'}, 
                        hide: 0
                    }
                ]
            })
            .populate('business_id')
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            
            return {
                result: getProducts,
                error: false
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }
        }

    }

    async productSearchCount (keyword) {
        try {
            let countResult = await ProductModel.countDocuments({
                $and: [
                    {
                        name: { $regex: '.*' + keyword + '.*', $options: 'i'}, 
                        hide: 0
                    }
                ]
            });
            return countResult
        } catch (error) {
            return 0;
        }
    }

    async homePageProducts (page) {
        
        try {

            // total number of returned products per request
            let limit = 30;

            let getProducts = await ProductModel.find({hide: 0})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('business_id')

            return {
                error: false,
                result: getProducts
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }
    }

    async performAdvancedSearch (communityId, queryString, page) {
        try {
            let limit = 50

            let searchBusiness = await BusinessModel.find({
                $and: [
                    {
                        'address.community': communityId, 
                        subscription_status: 0
                    }
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .map(async function(business) {  
                // return business.id;
                if (business.length > 0) {
                    
                    let productArray = []

                    for (let businessData of business) {

                        let searchProduct = await ProductModel.find({
                            $and: [
                                {
                                    name: { $regex: '.*' + queryString + '.*', $options: 'i'}, 
                                    hide: 0,
                                    business_id: businessData.id
                                }
                            ]
                        }).limit(10)
                        .populate('business_id');
                        
                        if (searchProduct.length > 0) {
                            searchProduct.forEach(element => {
                                productArray.push(element)
                            });
                        }
                    }

                    return productArray

                } else {
                    return []
                }
            })

            return {
                error: false,
                result: searchBusiness
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async performCategoryAdvancedSearch (communityId, typeId, type, page) {
        try {
            let limit = 50

            let searchBusiness = await BusinessModel.find({
                $and: [
                    {
                        'address.community': communityId, 
                        subscription_status: 0
                    }
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .map(async function(business) {  
                // return business.id;
                if (business.length > 0) {
                    
                    let productArray = []

                    for (let businessData of business) {

                        let searchProduct;

                        if (type.toLowerCase() == 'category') {
                            searchProduct = await ProductModel.find({
                                $and: [
                                    {
                                        category: typeId, 
                                        hide: 0,
                                        business_id: businessData.id
                                    }
                                ]
                            }).limit(12)
                            .populate('business_id');
                        } else {
                            searchProduct = await ProductModel.find({
                                $and: [
                                    {
                                        subcategory: typeId, 
                                        hide: 0,
                                        business_id: businessData.id
                                    }
                                ]
                            }).limit(10)
                            .populate('business_id');
                        }


                        
                        if (searchProduct.length > 0) {
                            searchProduct.forEach(element => {
                                productArray.push(element)
                            });
                        }
                    }

                    return productArray

                } else {
                    return []
                }
            })

            return {
                error: false,
                result: searchBusiness
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async countBusinessProducts (dataObject) {
        try {
            let countResult = await ProductModel.countDocuments({$and : [dataObject]});
            return countResult
        } catch (error) {
            return 0;
        }
    }

    async CustomerGetAllProductsByCategory (categoryId, page) {

        try {

            // total number of returned products per request
            let limit = 12;

            let getProducts = await ProductModel.find({
                $and: [
                    {
                        category: categoryId,
                        hide: 0
                    }
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category')
            .populate('subcategory')
            .populate('business_id')
        
            return {
                error: false,
                result: getProducts
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }

    }

    async CustomerGetAllProductsBySubcategory (subcategoryId, page) {

        try {

            // total number of returned products per request
            let limit = 12;

            let getProducts = await ProductModel.find({
                $and: [
                    {
                        subcategory: subcategoryId,
                        hide: 0
                    }
                ]
            })
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category')
            .populate('subcategory')
            .populate('business_id')
        
            return {
                error: false,
                result: getProducts
            } 

        } catch (error) {
            return {
                error: true,
                message: error.message
            }   
        }

    }
}