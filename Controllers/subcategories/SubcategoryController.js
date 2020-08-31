'use-strict'

const SubCatgoryModel = require('../../Models/Subcategory');
const CatgoryModel = require('../../Models/Categories');
const CategoryController = require('../category/CategoryController');


module.exports = class SubcategoryController extends CategoryController {
    constructor () {
        super();
    }

    async checkExists (data, categoryId) {
        try {
            const findResult = await CatgoryModel.find(
                data, {category_id: categoryId}
            ).limit(1).exec();   
    
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

    async createSubcategories (data) {
        try {
            const create = await SubCatgoryModel.insertMany(data);
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

    async findOneAndUpdate(subcategoryId, newDataObject) {
        try {
            let updateRecord = await SubCatgoryModel.findOneAndUpdate({_id: subcategoryId}, { $set:newDataObject }, {new : true });
            
            if (updateRecord == null) {
                return {
                    error: false,
                    result: false
                }
            } else {
                return {
                    error: false,
                    result: updateRecord
                }
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async GetOneSubcategory(subcategoryId) {
        try {
            const result = await SubCatgoryModel.findOne(
                { _id: subcategoryId}
            )
            .populate('category_id');

            let data = result._id.toString().length > 0 ? result : null;
            return {
                error: false,
                result: data
            };

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async createSubcategory (data) {
        try {
            
            let save = await data.save();

            return {
                error: false,
                result: save
            } 

        } catch (error) {
            return {
                error: false,
                message: error.message
            } 
        }
    }
}