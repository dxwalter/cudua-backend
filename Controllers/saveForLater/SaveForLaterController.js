"use-strict"

const FunctionRepository = require('../MainFunction');
const SaveForLaterModel = require('../../Models/SaveForLaterModel')

module.exports = class SaveForLaterController extends FunctionRepository {
    constructor () { super() }

    async InsertProduct(productId, userId, businessId) {
        let saveData = new SaveForLaterModel({
            owner: userId,
            product_id: productId,
            business_id: businessId
        });

        try {
            let save = await saveData.save();
            
            return {
                error: false,
                result: save
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }

    }

    async GetSavedProductsById(page, userId) {

        try {

            // total number of returned products per request
            let limit = 12;

            let getProducts = await SaveForLaterModel.find({owner: userId})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('product_id')

            let countDocuments = await SaveForLaterModel.countDocuments({owner: userId})
        
            let result = {
                totalNumberOfProducts: countDocuments,
                products: getProducts
            }
            
            return {
                error: false,
                result: result
            }


        } catch(error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async FindProductInSaveForLater(productId, userId) {

        try {
            
            let find = await SaveForLaterModel.findOne({
                $and: [
                    {owner: userId}, 
                    {product_id: productId}
                ]
            })

            return {
                result: find,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async removeSavedProduct(productId, userId) {

        try {
            
            let deleteItem = await SaveForLaterModel.deleteOne({
                $and: [{ owner: userId, product_id: productId }]
            });

            if (deleteItem.ok == 1 && deleteItem.deletedCount == 1) {
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
                error: true,
                message: error.message
            }
        }

    }
}