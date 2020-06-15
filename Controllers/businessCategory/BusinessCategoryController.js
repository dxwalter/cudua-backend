const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const BusinessCategoryModel = require('../../Models/BusinessCategory');
const CategoryModel = require('../../Models/Categories');
const SubcategoryModel = require('../../Models/Subcategory');

const BusinessController = require('../business/BusinessController')
const FunctionRepo = require('../MainFunction');
const { update } = require('../../Models/Categories');

module.exports = class BusinessCategoryController extends BusinessController {
    constructor () { super(); }

    async createBusinessCategory(businessCategoryData) {
        try {

            const create = await businessCategoryData.save();
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

    async insertSubcategory(businessCategoryId, data) {
        
        try {
            let find = BusinessCategoryModel.findOne({_id: businessCategoryId});

            find.subcategory = {"subcategory_id": data}

            update = await find.save()
            console.log(update)
          
            
        } catch (error) {
            
        }
    }

    async checkChoosenCategoryExist (categoryId, businessId) {
        
        try {
            const findResult = await BusinessCategoryModel.find(
                {
                    category_id: categoryId,
                    business_id: businessId
                }
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

    async getbusinessCategories (businessId) {
        try {
            const findResult = await BusinessCategoryModel.find({
                business_id : businessId
            }).populate('categoryList').populate('subcategoryList');   

            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return {
                       error: false,
                       result: findResult   
                   }
                }
            } 

            return {
                error: false,
                result: false   
            }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

}