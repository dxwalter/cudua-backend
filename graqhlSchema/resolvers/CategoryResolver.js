
let CreateCategory = require('../../Controllers/category/action/CreateCategory');
let ActivateCategory = require('../../Controllers/category/action/ActivateCategory');
let GetCategories = require('../../Controllers/category/action/GetCategories');

module.exports = {
    Query: {
        GetAllCategories() {
            let getAll = new GetCategories();
            return getAll.GetAll();
        },
        GetOneCategory(parent, args, context, info) {
            let getOneCategory = new GetCategories();
            return getOneCategory.GetOne(args.input);
        }
    },
    Mutation: {
        createCategory(parent, args, context, info) {
            // Remember to pass accessToken validation from Admin and customer
            // Since admin and customer are the only users to add or delete a category

            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            
            args = args.input

            let createCategoryObject = new CreateCategory();
            return createCategoryObject.createNewCategory(args.categoryName, args.subcategories, userId)
        },
        AdminCreateNewCategory (parent, args, context) {
            
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            
            args = args.input
            let createCat = new CreateCategory();
            return createCat.adminCreateCategory(args.industryId, args.categoryName, args.avatar);
        },
        ActivateCategory (parent, args, context, info) {
            // Remember to pass accessToken validation from Admin
            let activateCategory = new ActivateCategory();
            return activateCategory.ActivateMethod(args.input);

        }

    }
}