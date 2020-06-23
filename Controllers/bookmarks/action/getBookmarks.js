
const BookmarkController = require('../BookmarkController');
const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController')

const BookmarkModel = require('../../../Models/Bookmark');

module.exports = class GetBookmarks extends BookmarkController {
    constructor () { 
        super();
        this.BusinessCategoryController = new BusinessCategoryController();
        
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

        for (const [index, businessId] of bookmarkData.bookmarks.entries()) {
            businessIds[index] = businessId.business_id;
        }

        
        // let businessDetails = await this.BusinessCategoryController.getBusinessCategoryForBookmark(businessIds[0])
    
    }



}