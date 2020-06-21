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
            let find = await BusinessCategoryModel.findOne({_id: businessCategoryId});

            find.subcategory = {"subcategory_id": data}

            updateRecord = await find.save()
            
            return {
                error: false,
                result: updateRecord
            }
            
        } catch (error) {
            return {
                error: false,
                message: error.message   
            }
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

    async hideAndShowSubcategory (documentId, updateData) {
        try {
            const findResult = await BusinessCategoryModel.find({
                "subcategory._id" : documentId
            }).limit(1);

            
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                    
                    let subcategoriesCount = 0;
                    let subcategoryId = "";

                    for (let subcategory of findResult[0].subcategory) {
                        if (subcategory._id == documentId) {
                            
                            if (updateData == 'hide') {
                                findResult[0].subcategory[subcategoriesCount].hide = 1
                                subcategoryId = subcategory.subcategory_id;
                                break;
                            }

                            if (updateData == 'show') {
                                findResult[0].subcategory[subcategoriesCount].hide = 0
                                subcategoryId = subcategory.subcategory_id;
                                break;
                            }
                        }
                        subcategoriesCount = subcategoriesCount + 1;
                    }

                    try {
                        const updated = await findResult[0].save()
                        
                        if (updated._id.toString().length > 0) {
                            return {
                                error: false,
                                result: subcategoryId
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

    async updateChoosenCategory(documentId, data) {
        try {
            let updateRecord = await BusinessCategoryModel.findOneAndUpdate({_id: documentId}, { $set:data }, {new : true });
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
            
            console.log(findResult)
            return
        

        } catch (error) {
            
        }
    }
}