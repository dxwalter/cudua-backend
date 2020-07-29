"use-strict"

const FollowController = require('../FollowController');
const CategoryController = require('../../category/CategoryController')


module.exports = class GetFollowing extends FollowController {
    constructor() { 
        super();
        this.CategoryController = new CategoryController()
    }

    returnMethod (following, code, success, message) {
        return {
            following: following,
            code: code,
            success: success,
            message: message
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

        let categoriesNameArray = []

        Array.from(categoriesArray, x => {
            categoriesNameArray.push(x.categoryName)
        })

        // sort categories
        let sortedNames = categoriesNameArray.sort();
        let SortedCateories = [];
        // rearrange categories
        for (let sortedName of sortedNames) {

            // compare from first arranged array of categories
            for (let unsortedCategory of categoriesArray) {
                if (sortedName == unsortedCategory.categoryName) {
                    SortedCateories.push(unsortedCategory)
                }
            }

        }

        return SortedCateories;
    }

    async FormatData(data) {
        let followingArray = [];

        for (const [index, businessData] of data.entries()) {
            followingArray[index] = {
                businessId: businessData.business_id._id,
                username: businessData.business_id.username,
                businessName: businessData.business_id.businessname,
                logo: businessData.business_id.logo.length > 0 ? businessData.business_id.logo.length : null,
                review: businessData.business_id.review_score,
                businessCategory: businessData.categories.length > 0 ? await this.FormatCategories(businessData.categories) : null
            }
        }

        return followingArray


    }

    async CustomerGetFollowing (page, userId) {
        if (page == 0 || page < 1) page = 1

        let getData = await this.GetBusinessUserIsFollowing(page, userId);
        if (getData.error) return this.returnMethod(null, 500, false, "An error occurred from our end. Please try again")

        if (getData.result == null) return this.returnMethod(null, 200, false, "You are not following any business")

        if (getData.result.length < 1 && page > 1) return this.returnMethod(null, 200, true, 'That was all for now')
        
        let formatData = await this.FormatData(getData.result)

        return this.returnMethod(formatData, 200, true, "Successful")
    }

}
