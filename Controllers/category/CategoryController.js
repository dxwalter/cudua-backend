'use-strict'

const CategoryModel = require('../../Models/Categories'); 
 
const FunctionRepo = require('../MainFunction');

module.exports = class CategoryController extends FunctionRepo {
    constructor () { super(); }

    async checkCategoryExists (data) {
        
        try {
            const findResult = await CategoryModel.findOne(data).populate('subcategoryList').exec();

            return {
                error: false,
                result: findResult   
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

            const result = await CategoryModel.findOne(
                {status: 1, _id: categoryId}
            ).populate('subcategoryList');
                
            return {
                error: false,
                result: result
            };

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