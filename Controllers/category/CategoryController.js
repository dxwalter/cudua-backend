const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const CategoryModel = require('../../Models/Categories');
const FunctionRepo = require('../MainFunction');

module.exports = class CategoryController extends FunctionRepo {
    constructor () { super(); }

    async checkCategoryExists (name) {
        
        try {
            const findResult = await CategoryModel.find({
                name: name
            }).limit(1).exec();   
    
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return {
                       error: false,
                       result: true   
                   }
                }
            } else {
                return {
                    error: false,
                    result: false   
                }
            }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async CreateCategory (Category) {
        try {

            const create = await Category.save();
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

    async findOneAndUpdate(categoryId, newDataObject) {
        try {
            let updateRecord = await CategoryModel.findOneAndUpdate({_id: categoryId}, { $set:newDataObject }, {new : true });
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