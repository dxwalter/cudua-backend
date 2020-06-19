
const BookmarkController = require('../BookmarkController');
const UserController = require('../../user/UserController')

const BookmarkModel = require('../../../Models/Bookmark');

module.exports = class CreateBookmark extends BookmarkController {

    constructor () { 
        super();
        this.userDetails = new UserController();
    }

    async createBookmark (businessId, userId) {
        
        if (businessId.length < 1 || userId.length < 1) {
            return {
                code: 200,
                success: false,
                message: "The business details of the business you want to bookmark was not provided. Kindly refresh the page and try again"
            }
        }

        let getUserDetails = await this.userDetails.findUsersById(userId);
        
        if (getUserDetails.error == true) {
            return {
                code: 500,
                success: false,
                message: "An error occurred bookmarking this business and it is our fault. Kindly refresh the page and try again"
            }
        }


        if (businessId == getUserDetails.result.business_id) {
            return {
                code: 200,
                success: false,
                message: "An error occurred. You cannot bookmark your own business"
            }
        }

        // check user has created a bookmark before. if true, add to the list else create a new one

        let getUserBookmarks = await this.findUserBookMarks(userId);
        if (getUserBookmarks.error == true) {
            return {
                code: 500,
                success: false,
                message: "An error occurred bookmarking this business and it is our fault. Kindly refresh the page and try again"
            }
        } 


        let getBusinessName = await (await this.getBusinessData(businessId)).result.businessname;

        if (getUserBookmarks.result != false) {

            let userBookmark =  getUserBookmarks.result[0];

            let userBookmarkId = userBookmark._id;

            if (userBookmarkId.toString().length > 0) {
                
                // iterate through to check if this business has been bookmarked before
                for (let bookmarks of userBookmark.bookmarks) {
                    if (businessId == bookmarks.business_id) {
                        return {
                            code: 200,
                            success: true,
                            message: `${getBusinessName} was successfully bookmarked`
                        }
                    }
                }

                // add to bookmark
                // update subdocument
                let updateNewRecord = await this.addBusinessToBookmark(userId, businessId);


                if (updateNewRecord.error == true) {
                    return {
                        code: 500,
                        success: false,
                        message: "An error occurred. Kindly refresh the page and try again"
                    }
                }
        
                return {
                    code: 202,
                    success: true,
                    message: `You have successfully bookmarked '${getBusinessName}'`
                }
            }
        }


        // create new user bookmark document

        let bookmarkArray = [];
        bookmarkArray[0] = {business_id: businessId}
        
        const createBookmark = new BookmarkModel ({
            author : userId,
            bookmarks: bookmarkArray,
        });

        let create = await this.createNewBookmark(createBookmark)
        
        if (create.error == true) {
            return {
                code: 500,
                success: false,
                message: "An error occurred. Kindly refresh the page and try again"
            }
        }

        return {
            code: 202,
            success: true,
            message: `You have successfully bookmarked '${getBusinessName}'`
        }


    }

}