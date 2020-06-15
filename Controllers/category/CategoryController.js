const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const CategoryModel = require('../../Models/Categories'); 
const Subcategory = require('../../Models/Subcategory'); 
const FunctionRepo = require('../MainFunction');

module.exports = class CategoryController extends FunctionRepo {
    constructor () { super(); }

    async checkCategoryExists (data) {
        
        try {
            const findResult = await CategoryModel.find(data).limit(1).exec();   
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return {
                       error: false,
                       result: findResult   
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

    async GetAllCategories () {
        try {
            const result = await CategoryModel.find(
                {status: 1}
            ).populate('subcategoryList');
            
            if (result.length > 0) {
                return {
                    error: false,
                    result: result
                };
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

    async GetOneCategory(categoryId) {
        try {

            const result = await CategoryModel.find(
                {status: 1, _id: categoryId}
            ).populate('subcategoryList').limit(1);

            if (result.length > 0) {
                return {
                    error: false,
                    result: result
                };
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
    
}