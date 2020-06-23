const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const BusinessCategoryModel = require('../../Models/BusinessCategory');
const CategoryModel = require('../../Models/Categories');
const SubcategoryModel = require('../../Models/Subcategory');
const BookmarkModel = require('../../Models/Bookmark');

const BusinessController = require('../business/BusinessController')
const FunctionRepo = require('../MainFunction');

module.exports = class BookmarkController extends BusinessController {
    constructor () { super(); }

    async createNewBookmark(bookmarkData) {
        try {

            const create = await bookmarkData.save();
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

    async countUserBookmark (userId) {
        try {
            let count = await BookmarkModel.where({ author: userId }).countDocuments();
            return {
                error: false,
                result: count
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async findUserBookMarks (userId) {
        try {

            let findResult = await BookmarkModel.find({author: userId});
    
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

    async deleteUserBookmark(userId, businessId) {
        
        try {
            
            let deleteBookmark = await BookmarkModel.updateOne({author: userId}, 
                {$pull : {bookmarks : {"business_id" : businessId }}},
                {new: true}
            );

            if (deleteBookmark.nModified == 1 && deleteBookmark.ok == 1) {
                return {
                    error: false,
                    result: true
                }
            } 

            return {
                error: true,
                message: "We could not unbookmark this business"
            }
           
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }


    async addBusinessToBookmark(userId, businessId) {
        try {

            let findRecord = await BookmarkModel.findOne({author: userId});
            findRecord.bookmarks.push({"business_id": businessId})
            
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

    async getBookmarkListing (userId) {
        try {

            let findResult = await BookmarkModel.find({author: userId}).populate("BookmarkBusinessDetailsList").populate('BusinessCategoryList');
            console.log(findResult)

            return;

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