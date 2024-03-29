'use-strict'

const BusinessCategoryModel = require('../../Models/BusinessCategory');
const CategoryModel = require('../../Models/Categories');
const SubcategoryModel = require('../../Models/Subcategory');

const BusinessController = require('../business/BusinessController')
const FunctionRepo = require('../MainFunction');

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

            let newArrayOfSubcategories = [];

            for(let newSubcategory of updateSubcategoryArray) {
                newArrayOfSubcategories.push({"subcategory_id": newSubcategory})
            }

            find.subcategories = newArrayOfSubcategories
            
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

    async getbusinessCategories (businessId) {
        try {
            const findResult = await BusinessCategoryModel.find({
                business_id : businessId
            })
            .sort({_id: -1})
            .populate({
                path: 'category_id',
                model: 'categories',
            }).populate({
                path: 'subcategories.subcategory_id',
                model: 'subcategories'
            })

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

    async getOneBusinessCategory (businessId, categoryId) {
        try {
            const findResult = await BusinessCategoryModel.findOne({
                $and: [{ business_id: businessId, category_id: categoryId}]    
            })
            .sort({_id: -1})
            .populate({
                path: 'category_id',
                model: 'categories',
            }).populate({
                path: 'subcategories.subcategory_id',
                model: 'subcategories'
            })

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

    async deleteChoosenCategory (businessId, categoryId) {
        try {
            
            let deleteItem = await BusinessCategoryModel.deleteOne({
                $and: [{ business_id: businessId, category_id: categoryId}]
            })

            if (deleteItem.ok == 1) {
                return {
                    result: true,
                    error: false
                }
            } else {
                return {
                    result: false,
                    error: false
                }
            }
           
        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }
    
}