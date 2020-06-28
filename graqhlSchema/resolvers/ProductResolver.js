
const { GraphQLUpload } = require('apollo-upload-server');
let CreateProduct = require('../../Controllers/product/action/createNewProduct')

module.exports = {
    Upload: GraphQLUpload,
    Query: {

    },
    Mutation: {
        CreateProduct (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            args = args.input;

            let createNewProduct = new CreateProduct();
            return createNewProduct.createProduct(args.name, args.price, args.category, args.subcategory, args.businessId, args.file, userId)

        }
    }
}