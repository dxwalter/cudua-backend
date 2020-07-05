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