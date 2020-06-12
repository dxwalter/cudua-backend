
const SubCatgoryModel = require('../../Models/Subcategory');
let CategoryController = require('../category/CategoryController');


module.exports = class SubcategoryController extends CategoryController {
    constructor () {
        super();
    }

    async checkExists (name, categoryId) {
        try {
            const findResult = await SubCatgoryModel.find(
                {name: name}, {category_id: categoryId}
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
}