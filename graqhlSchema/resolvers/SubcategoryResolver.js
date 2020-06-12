
const CreateSubCategory = require('../../Controllers/subcategories/action/createSubcategory');

module.exports = {
    Query: {

    },
    Mutation: {
        createSubCategory (parent, args, context, info) {
            let create = new CreateSubCategory(args.input);
            return create.validateInputSubcategory()
        }
    }
}