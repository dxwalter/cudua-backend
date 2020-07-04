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

    async insertSubcategory(businessId, categoryId, updateSubcategoryArray) {

        try {
            let find = await BusinessCategoryModel.findOne({business_id: businessId, category_id: categoryId});

            for(let newSubcategory of updateSubcategoryArray) {
                find.subcategories.push({"subcategory_id": newSubcategory})
            }
            
            let updateRecord = await find.save()

          
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

    async checkChoosenCategoryExist (categoryId, businessId) {
        
        try {
            const findResult = await BusinessCategoryModel.findOne(
                {
                    category_id: categoryId,
                    business_id: businessId
                }
            );   
           
        
            if (findResult != null) {
                return {
                    error: false,
                    result: findResult   
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
            }).populate({
                path: 'category_id',
                model: 'categories',
            }).populate({
                path: 'subcategories.subcategory_id',
                model: 'subcategories'
            })

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

    async hideAndShowSubcategory (businessId, categoryId, subcategoryId, updateData) {
        try {
            const findResult = await BusinessCategoryModel.find(
                {
                    business_id: businessId,
                    category_id: categoryId,
                }
            ).limit(1);
            
            if (findResult.length > 0) {
                if (findResult[0]._id) {

                    for (const [index, subcategory] of findResult[0].subcategories.entries()) {
                        if (subcategory.subcategory_id == subcategoryId) {
                            
                            if (updateData == 'hide') {
                                findResult[0].subcategories[index].hide = 1
                                break;
                            }

                            if (updateData == 'show') {
                                findResult[0].subcategories[index].hide = 0
                                break;
                            }
                        }

                    }

                    try {

                        
                        const updated = await findResult[0].save();
                        
                        if (updated._id.toString().length > 0) {
                            return {
                                error: false,
                                result: true
                            }
                        } else {
                            return {
                                error: false,
                                result: false
                            }
                        }

                    } catch (error) {
                        return {
                            error: false,
                            message: error.message
                        }
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

    async updateChoosenCategory(businessId, categoryId, data) {
        try {
            let updateRecord = await BusinessCategoryModel.findOneAndUpdate(
                {
                    business_id: businessId,
                    category_id: categoryId
                },
                { $set:data }, {new : true }
            );

            if (updateRecord) {
                return {
                    error: false,
                    result : updateRecord,
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

    async getBusinessCategoryForBookmark (businessId) {
        try {
            const findResult = await BusinessCategoryModel.find({
                business_id : businessId
            });
            
            
            return
        

        } catch (error) {
            
        }
    }

    
}