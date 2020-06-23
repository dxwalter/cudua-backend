const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const CategoryModel = require('../../Models/Categories'); 
const Subcategory = require('../../Models/Subcategory'); 
const FunctionRepo = require('../MainFunction');
const res = require('express/lib/response');

module.exports = class CategoryController extends FunctionRepo {
    constructor () { super(); }

    async checkCategoryExists (data) {
        
        try {
            const findResult = await CategoryModel.find(data).populate('subcategoryList').limit(1).exec();
               
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

    
    async createNewSubcategory(categoryId, subcategories) {
        try {

            let findRecord = await CategoryModel.findOne({_id: categoryId});


            for(let items of subcategories) {
                findRecord.subcategories.push(items)
            }
            
            let updateRecord = await findRecord.save()

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
                {status: 1},
            ).populate({
                path: 'subcategoryList',
            });
            
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

    async GetMultipleCategories(categoryArray) {
        try {

            const result = await CategoryModel.find(
                {
                    '_id' : { $in: categoryArray }
                }
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
    
}