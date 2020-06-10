
let CreateCategory = require('../../Controllers/category/action/CreateCategory');
let ActivateCategory = require('../../Controllers/category/action/ActivateCategory');

module.exports = {
    Query: {

    },
    Mutation: {
        createCategory(parent, args, context, info) {
            // Remember to pass accessToken validation from Admin
            // Since admin is the only user to add or delete a category

            // let accessToken = context.accessToken;
            // let userId = context.authFunction(accessToken);
            // if (userId.error == true) {
            //     return userId
            // } else {
            //     userId = userId.message;
            // }

            let createCategoryObject = new CreateCategory(args.input);
            return createCategoryObject.validateInput()
        },
        ActivateCategory (parent, args, context, info) {
            // Remember to pass accessToken validation from Admin
            let activateCategory = new ActivateCategory();
            return activateCategory.ActivateMethod(args.input);

        }

    }
}