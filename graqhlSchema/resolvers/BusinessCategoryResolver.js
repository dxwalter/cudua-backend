
const ChooseCategory = require('../../Controllers/businessCategory/action/createBusinessCategories');
const HideBusinessCategory = require('../../Controllers/businessCategory/action/hideBusinessCategory');
const ShowBusinessCategory = require('../../Controllers/businessCategory/action/showBusinessCategory');

// hide business subcategory
const HideBusinessSubcategory = require('../../Controllers/businessCategory/action/hideBusinessSubcategory');
// show business subcategory
const ShowBusinessSubcategory = require('../../Controllers/businessCategory/action/showBusinessSubcategory');

module.exports = {
    Query: {

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
            return hide.hideCategory(args.input.selectedCategoryId);
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
            return show.showCategory(args.input.selectedCategoryId);
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
            return hideBusinessSubcategory.hideSubcategory(args.input.selectedSubcategoryId)
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
            return showBusinessSubcategory.showSubcategory(args.input.selectedSubcategoryId)
        }
    }
}