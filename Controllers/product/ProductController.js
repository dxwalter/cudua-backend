let ProductModel = require('../../Models/Product')
const BusinessController = require('../business/BusinessController')

module.exports = class ProductController extends BusinessController {

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

    async GetBusinessProductsByCategory(businessId, categoryId, page) {

        try {

            // total number of returned products per request
            let limit = 12;

            let getProducts = await ProductModel.find({business_id: businessId, category: categoryId})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category')
            .populate('subcategory')


            let countDocuments = await ProductModel.countDocuments({business_id: businessId, category: categoryId});
            console.log(countDocuments)
            let result = {
                totalNumberOfProducts: countDocuments,
                products: getProducts.length > 0 ? getProducts : null
            }

            if (getProducts.length > 0) {

                return {
                    error: false,
                    result: result
                } 

            } else {
                
                return {
                    error: false,
                    result: result
                }
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

            let getProducts = await ProductModel.find({business_id: businessId, subcategory: subcategoryId})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category')
            .populate('subcategory')


            let countDocuments = await ProductModel.countDocuments({business_id: businessId, subcategory: subcategoryId});
            let result = {
                totalNumberOfProducts: countDocuments,
                products: getProducts.length > 0 ? getProducts : null
            }

            if (getProducts.length > 0) {

                return {
                    error: false,
                    result: result
                } 

            } else {
                
                return {
                    error: false,
                    result: result
                }
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

            if (getProducts.length > 0) {

                return {
                    error: false,
                    result: result
                } 

            } else {
                
                return {
                    error: false,
                    result: result
                }
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

}