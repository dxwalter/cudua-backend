
const ChooseCategory = require('../../Controllers/businessCategory/action/createBusinessCategories');
const HideBusinessCategory = require('../../Controllers/businessCategory/action/hideBusinessCategory');
const ShowBusinessCategory = require('../../Controllers/businessCategory/action/showBusinessCategory');

// hide business subcategory
const HideBusinessSubcategory = require('../../Controllers/businessCategory/action/hideBusinessSubcategory');
// show business subcategory
const ShowBusinessSubcategory = require('../../Controllers/businessCategory/action/showBusinessSubcategory');

// get business category
const GetCateories = require('../../Controllers/businessCategory/action/getBusinessCatgory');

module.exports = {
    Query: {
        GetBusinessCategoriesWithSubcategory (_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            args = args.input

            let getCategory = new GetCateories();
            return getCategory.getBusinessCategoriesAndSubcategoriesWithCount(args.businessId, userId)
        }
    },
    Mutation: {
        CreateBusinessCategory(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let createBusinessCategory = new ChooseCategory();
            return createBusinessCategory.ChooseCategory(args.input.businessId, args.input.categoryId, args.input.subcategories)
            
        },
        HideSelectedBusinessCategory(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let hide = new HideBusinessCategory();
            return hide.hideCategory(args.input.categoryId, args.input.businessId);
        },
        ShowSelectedBusinessCategory(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let show = new ShowBusinessCategory();
            return show.showCategory(args.input.categoryId, args.input.businessId);
        },
        HideSelectedBusinessSubcategory(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let hideBusinessSubcategory = new HideBusinessSubcategory();
            return hideBusinessSubcategory.hideSubcategory(args.input.businessId, args.input.categoryId, args.input.subcategoryId)
        },
        ShowSelectedBusinessSubcategory (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let showBusinessSubcategory = new ShowBusinessSubcategory();
            return showBusinessSubcategory.showSubcategory(args.input.businessId, args.input.categoryId, args.input.subcategoryId)
        }
    }
}