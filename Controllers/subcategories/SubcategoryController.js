
const SubCatgoryModel = require('../../Models/Subcategory');
const CatgoryModel = require('../../Models/Categories');
let CategoryController = require('../category/CategoryController');
const { updateOne } = require('../../Models/Categories');


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

            const result = await SubCatgoryModel.find(
                { _id: subcategoryId}
            ).limit(1);

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