'use-strict'

const BookmarkController = require('../BookmarkController');
const UserController = require('../../user/UserController')

const BookmarkModel = require('../../../Models/Bookmark');

module.exports = class CreateBookmark extends BookmarkController {
    constructor () { super() }

    async removeBookmark (businessId, userId) {
        
        // check user has created a bookmark before. if true, add to the list else create a new one

        let getUserBookmarks = await this.findUserBookMarks(userId);
        if (getUserBookmarks.error == true) {
            return {
                code: 500,
                success: false,
                message: "An error occurred unbookmarking this business and it is our fault. Kindly refresh the page and try again"
            }
        } 


        let getBusinessName = await (await this.getBusinessData(businessId)).result.businessname;

        if (getUserBookmarks.result != false) {

            // delete 
            let deleteBookmark = await this.deleteUserBookmark(userId, businessId);
            
            if (deleteBookmark.error == true) {
                return {
                    code: 200,
                    success: false,
                    message: deleteBookmark.message
                }
            }

            return {
                code: 200,
                success: true,
                message: `You have successfully unbookmarked '${getBusinessName}'`
            }
        }

    }
}