

const CreateSubCategory = require('../../Controllers/subcategories/action/createSubcategory');
const ActivateSubcategory = require('../../Controllers/subcategories/action/ActivateSubcategory');

module.exports = {
    Query: {

    },
    Mutation: {
        createSubCategory (parent, args, context, info) {
            // Remember to pass accessToken validation
            // admin and users can add subcategoies

            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            
            args = args.input

            let create = new CreateSubCategory();
            return create.createNewSubcategory(args.categoryId, args.subcategories, userId);
        },
        AdminCreateSubcategory (parent, args, context, info) {

            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            
            args = args.input

            let create = new CreateSubCategory();
            return create.AdminCreateSubcategory(args.categoryId, args.subcategories, userId);
        },
        ActivateSubcategory (parent, args, context, info) {
            // Remember to pass accessToken validation from Admin
            // admins alone can activate subcategories
            let activate = new ActivateSubcategory();
            return activate.ActivateMethod(args.input)
        }
    }
}