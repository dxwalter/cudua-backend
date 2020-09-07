
const { GraphQLUpload } = require('apollo-upload-server');

let CreateProduct = require('../../Controllers/product/action/createNewProduct');
let EditProduct = require('../../Controllers/product/action/editProduct');
let ProductVisibility = require('../../Controllers/product/action/hideAndShowProduct');
let GetProduct = require('../../Controllers/product/action/getProducts')

module.exports = {
    Upload: GraphQLUpload,
    Query: {
        GetProductById(_, args) {
            let getProduct  = new GetProduct();
            return getProduct.getProductById(args.input.productId);
        },
        BusinessGetProductByCategory(_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            args = args.input;

            let getProductByCategory = new GetProduct();
            return getProductByCategory.businessGetProductByCategory(args.businessId, args.categoryId, args.page, userId)
        },
        BusinessGetProductBysubCategory(_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            args = args.input;

            let getProductByCategory = new GetProduct();
            return getProductByCategory.businessGetProductBySubcategory(args.businessId, args.subcategoryId, args.page, userId)            
        },
        BusinessSearchProduct(_, args, context) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }
            args = args.input;

            let searchForProduct = new GetProduct();
            return searchForProduct.SearchForBusinessProduct(args.businessId, args.keyword.trim(), userId)            
        },
        GetProductsUsingBusinessId(_, args) {
            args = args.input
            let getProducts = new GetProduct();
            return getProducts.getProductByBusinessId(args.businessId, args.page)
        }
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
        EditBasicDetails(parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            args = args.input

            let editProduct = new EditProduct();
            return editProduct.editProductBasicDetails(
                args.productName,
                args.productPrice,
                args.category,
                args.subcategory,
                args.businessId,
                args.productId,
                userId
            );
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
            return editProduct.removeProductTag(args.input.tagId, args.input.productId, args.input.businessId, userId);
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
            return editProduct.removeProductSize(args.input.sizeId, args.input.productId, args.input.businessId, userId);
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
            return editProduct.removeProductColor(args.input.colorId, args.input.productId, args.input.businessId, userId);
        },
        HideProduct (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let hideProduct = new ProductVisibility();
            return hideProduct.HideProduct(args.input.productId, args.input.businessId, userId)
        },
        ShowProduct (parent, args, context, info) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) {
                return userId
            } else {
                userId = userId.message
            }

            let showProduct = new ProductVisibility();
            return showProduct.ShowProduct(args.input.productId, args.input.businessId, userId)
        }
    }
}