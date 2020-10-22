"use-strict"

const FollowController = require('../FollowController');
const CategoryController = require('../../category/CategoryController')
const BusinessController = require('../../business/BusinessController');
const LocationController = require('../../Location/LocationController');

module.exports = class GetFollowing extends FollowController {
    constructor() { 
        super();
        this.CategoryController = new CategoryController();
        this.BusinessController = new BusinessController();
        this.LocationController = new LocationController();
    }

    returnBusinessMethod (customerData, code, success, message) {
        return {
            customerData: customerData,
            code: code,
            success: success,
            message: message
        }
    }

    returnCustomerMethod (following, code, success, message) {
        return {
            following: following,
            code: code,
            success: success,
            message: message
        }
    }

    async formatAddress (addressData) {

        if (addressData.street == undefined || addressData.street.length == 0) {
            return null
        }

        let streetData = await this.LocationController.SearchStreetById(addressData.street);

        if (streetData.error) return null


        return {
            number: addressData.number,
            street: streetData.result.name,
            community: streetData.result.community_id.name,
            lga: streetData.result.lga_id.name,
            state: streetData.result.state_id.name,
            country: streetData.result.country_id.name
        }
    }

    async FormatCategories(categories) {
        let categoriesArray = [];

        for (const [index, category] of categories.entries()) {
            let categoryName = await (await this.CategoryController.GetOneCategory(category.category_id)).result.name
            categoriesArray[index] = {
                itemId: category._id,
                categoryId: category.category_id,
                categoryName: categoryName,
                hide: category.hide
            }
        } 

        if (categoriesArray.length < 1) return null

        return this.SortCategories(categoriesArray);
    }

    async FormatData(data) {
        let followingArray = [];

        for (const [index, businessData] of data.entries()) {
            followingArray[index] = {
                businessId: businessData.business_id._id,
                username: businessData.business_id.username,
                businessName: businessData.business_id.businessname,
                logo: businessData.business_id.logo.length > 0 ? businessData.business_id.logo : "",
                review: businessData.business_id.review_score,
                address: await this.formatAddress(businessData.business_id.address),
                businessCategory: businessData.categories.length > 0 ? await this.FormatCategories(businessData.categories) : null
            }
        }

        return followingArray

    }

    async CustomerGetFollowing (page, userId) {
        if (page == 0 || page < 1) page = 1

        let getData = await this.GetBusinessUserIsFollowing(page, userId);
        if (getData.error) return this.returnCustomerMethod(null, 500, false, "An error occurred from our end. Please try again")

        if (getData.result == null) return this.returnCustomerMethod(null, 200, false, "You are not following any business")

        if (getData.result.length < 1 && page > 1) return this.returnCustomerMethod(null, 200, true, 'That was all for now')
        
        let formatData = await this.FormatData(getData.result)

        return this.returnCustomerMethod(formatData, 200, true, "Successful")
    }

    async BusinessGetFollowers(page, businessId, userId) {

        if (page == 0 || page < 1) page = 1
        
        if (businessId.length < 1) return this.returnBusinessMethod(null, 500, false, "An error occurred. Your business credential was not provided")


        let businessData = await this.BusinessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnBusinessMethod(null, 500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnBusinessMethod(null, 500, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getBusinessFollowers = await this.GetBusinessFollowers(page, businessId);

        if (getBusinessFollowers.error) return this.returnBusinessMethod(null, 500, false, "An error occurred from our end. Please try again")

        if (getBusinessFollowers.result.length < 1 && page > 1) return this.returnBusinessMethod(null, 200, true, 'That was all for now');

        let customerArray = [];

        for (const [index, customer] of getBusinessFollowers.result.entries()) {
            if (customer.customer_id != null) {
                customerArray.push({
                    name: customer.customer_id.fullname,
                    profilePhoto: customer.customer_id.profilePicture,
                    reviewScore: customer.customer_id.review_score,
                    userId: customer.customer_id._id
                })
            }
        }

        return this.returnBusinessMethod(customerArray, 200, true, "Followers retrieved successfully")

    }



}
