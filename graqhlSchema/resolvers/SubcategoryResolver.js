const CreateSubCategory = require('../../Controllers/subcategories/action/CreateSubcategory.js');
const ActivateSubcategory = require('../../Controllers/subcategories/action/ActivateSubcategory');

module.exports = {
    Query: {

    },
    Mutation: {
        createSubCategory (parent, args, context, info) {
            // Remember to pass accessToken validation
            // admin and users can add subcategoies
            let create = new CreateSubCategory(args.input);
            return create.validateInputSubcategory()
        },
        ActivateSubcategory (parent, args, context, info) {
            // Remember to pass accessToken validation from Admin
            // admins alone can activate subcategories
            let activate = new ActivateSubcategory();
            return activate.ActivateMethod(args.input)
        }
    }
}