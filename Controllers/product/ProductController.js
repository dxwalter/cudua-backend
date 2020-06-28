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

}