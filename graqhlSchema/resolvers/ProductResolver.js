
const { GraphQLUpload } = require('apollo-upload-server');
let CreateProduct = require('../../Controllers/product/action/createNewProduct');
let EditProduct = require('../../Controllers/product/action/editProduct');

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

        },
        AddmorePhotos (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            args = args.input;

            let editProduct = new EditProduct();
            return editProduct.addMorePhotos(args.file, args.productId, args.businessId, userId);

        },
        MakePrimaryImage (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            args = args.input;

            let editProduct = new EditProduct();
            return editProduct.makePrimaryImage(args.imageName, args.productId, args.businessId, userId);

        },
        RemoveProductPicture (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            args = args.input;

            let editProduct = new EditProduct();
            return editProduct.removeProductImage(args.imageName, args.productId, args.businessId, userId);
        },
        EditDescription (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let editProduct = new EditProduct();
            return editProduct.editProductDescription(args.input.description, args.input.productId, args.input.businessId, userId);
        },
        EditProductTags (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let editProduct = new EditProduct();
            return editProduct.editProductTags(args.input.tags, args.input.productId, args.input.businessId, userId);
        },
        RemoveProductTag (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let editProduct = new EditProduct();
            return editProduct.removeProductTag(args.input.tag, args.input.productId, args.input.businessId, userId);
        },
        CreateProductSizes (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let editProduct = new EditProduct();
            return editProduct.createAvailableSizes(args.input.sizes, args.input.productId, args.input.businessId, userId);
        },
        RemoveProductSize (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let editProduct = new EditProduct();
            return editProduct.removeProductSize(args.input.size, args.input.productId, args.input.businessId, userId);
        },
        CreateProductColors (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let editProduct = new EditProduct();
            return editProduct.createAvailableColors(args.input.colors, args.input.productId, args.input.businessId, userId);
        },
        RemoveProductColor (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let editProduct = new EditProduct();
            return editProduct.removeProductColor(args.input.color, args.input.productId, args.input.businessId, userId);
        }
    }
}