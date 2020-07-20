'use-strict'

const BookmarkController = require('../BookmarkController');
const BusinessController = require('../../business/BusinessController');


module.exports = class GetBookmarkers extends BookmarkController {
    constructor () { 
        super();
        this.BusinessController = new BusinessController()
    }

    returnData (customerData, code, success, message) {
        return {
            customerData: customerData,
            code: code,
            success: success,
            message: message
        }
    }

    async myBookmarkers(businessId, userId) {
        
        let businessData = await this.BusinessController.getBusinessData(businessId);
        
        if (businessData.error == true) {
            return this.returnData(null, 500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getBookmarkers = await this.getMyBusinessBookmarkers(businessId);

        if (getBookmarkers.error == true) {
            return this.returnData(null, 500, false, "An error occurred retrieving your bookmarkers. Kindly refresh the page and try again")
        }

        if (getBookmarkers.result.length < 1) {
            return this.returnData(null, 200, true, "Your business is yet to be bookmarked by a customer")
        }

        let dataArray = [];
        let count = 0;

        for (let data of getBookmarkers.result) {
            
            dataArray[count] = {
                name: data.author.fullname,
                profilePicture: data.author.profilePicture
            }

            count = count + 1;
        }

        return this.returnData(dataArray, 200, true, `List of bookmarkers retrieved`)


    }

}