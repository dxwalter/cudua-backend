const Connection = require('./mysqlConnection');
const util = require('util');
// node native promisify
const query = util.promisify(Connection.query).bind(Connection);

const CategoriesModel = require('../../Models/Categories')
const SubcategoryModel = require('../../Models/Subcategory')

module.exports = class moveDataController {
    
    constructor () {

    }

    returnResult(data) {
        return JSON.parse(JSON.stringify(data))
    }

    async getCategoriesFromMySql () {
        console.log("Getting categories");
        let categories = await query('SELECT * FROM `categories`');
        return this.returnResult(categories)
    }

    async getSubcategoriesFromMysql () {
        console.log("Getting subcategories");
        let subcategories = await query('SELECT * FROM `subcategories`');
        return this.returnResult(subcategories)
    }

    async saveCategoriesToMongo (data) {
    
        try {
            let createMany = await CategoriesModel.insertMany(data);
            
            if (createMany.length > 0) return {error: false}

        } catch (error) {

            return {
                error: true
            }
        }
    }


    async GetCategoryMongoId (mysqlId) {
        try {
            const findProduct = await CategoriesModel.findOne({ms_id: mysqlId}).exec();

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

    async saveSubcategoriesToMongo (data) {
    
        try {
            let createMany = await SubcategoryModel.insertMany(data);
            
            if (createMany.length > 0) return {error: false}

        } catch (error) {
            
            return {
                error: true
            }
        }
    }



    async unsetMysqlIdField() {
        await CategoriesModel.updateMany({}, {$unset:{"ms_id":1}})
    }
}