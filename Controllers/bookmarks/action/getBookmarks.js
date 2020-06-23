
const BookmarkController = require('../BookmarkController');
const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');
const CategoryController = require('../../category/CategoryController');


const BookmarkModel = require('../../../Models/Bookmark');

module.exports = class GetBookmarks extends BookmarkController {
    constructor () { 
        super();
        this.BusinessCategoryController = new BusinessCategoryController();
        this.CategoryController = new CategoryController()
        
    }

    returnData (bookmarks, code, success, message) {
        return {
            bookmarks: bookmarks,
            code: code,
            success: success,
            message: message
        }
    }

    async getMyBookmarks (userId) {

        
        let bookmarkData = await this.getBookmarkListing(userId);
        
        if (bookmarkData.error == true) {
            return this.returnData(null, 500, false, "An error occurred getting your bookmarks. Kindly refresh the page and try again")
        }

        if (bookmarkData.error == false && bookmarkData.result == false) {
            return this.returnData(null, 200, true, "You do not have any bookmark. Visit a shop to bookmark")
        }

        // returned result
        bookmarkData = bookmarkData.result
        let businessIds = [];
        let categoryObject = [];

        let dataManager = [];

        

        for (const [firstIndex, data] of bookmarkData.entries()) {
            // get business details
            for (const [businessDetailsIndex, businessDetails] of data.BookmarkBusinessDetailsList.entries())
            dataManager[firstIndex] = {
                businessId : businessDetails._id,
                businessName: businessDetails.businessname,
                username: businessDetails.username,
                logo: businessDetails.logo,
                businessCategory: []
            }

            // note that BusinessCategoryList is an array of array of object
            // BusinessCategoryList[[categorydata_1, categorydata_n]] 

            let businessCategories = data.BusinessCategoryList;
            
            for (const [categoryIndex, category] of businessCategories[0].entries()) {
                let catId = category.category_id;
                
                if (categoryObject[catId] == undefined) {
                    // retrieve category datails
                    let getCategory = await this.CategoryController.GetOneCategory(catId);
                    if (getCategory.error == false) {
                        let newData = {
                            categoryId: getCategory.result[0]._id,
                            categoryName: getCategory.result[0].name
                        }

                        // store in businesscategory
                        dataManager[firstIndex].businessCategory.push(newData)

                        // add to categoryObject
                        categoryObject[catId] = newData;

                    }
                    
                } else {
                    // update businessCategory of dataManager
                    dataManager[firstIndex].businessCategory.push(categoryObject[catId]);
                }
            }
        }

        console.log(categoryObject)
        return this.returnData(dataManager, 200, true, "Your bookmarks has been successfully retrieved")
    
    }



}