'use-strict'

const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');
const BusinessController = require('../../business/BusinessController');
const ProductController = require('../../product/ProductController');
const SubcategoryController = require('../../subcategories/SubcategoryController');

const SaveForLaterController = require('../../saveForLater/SaveForLaterController')
const CartController = require('../../cart/CartController');
const OrderController = require('../../order/orderController');
const AnonymousCartController = require('../../anonymousCart/anonymousCartController');

module.exports = class DeleteSelectedSubcategory extends BusinessCategoryController {
    constructor () {
        super();
        this.businessController = new BusinessController();
        this.productController = new ProductController();
        this.subcategoryController = new SubcategoryController();

        this.SaveForLaterController = new SaveForLaterController()
        this.CartController = new CartController()
        this.OrderController = new OrderController()
        this.AnonymousCartController = new AnonymousCartController()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        };
    }

    async deleteSubcategory (subcategoryId, businessId) {
        
        // validation
        if (subcategoryId.length == 0 || businessId.length == 0) return this.returnMethod(200, false, "The data required to perform this operation was not provided. Refresh page and try again")

        // subcategory details
        let subcat = await this.subcategoryController.GetOneSubcategory(subcategoryId);

        if (subcat.error) return this.returnMethod(500, false, "An error occurred. Please try again");

        let subcatDetails = subcat.result;

        if (subcatDetails == null) return this.returnMethod(200, false, "This subcategory has either been moved or deleted");


        // get selected category
        let categoryId = subcatDetails.category_id._id;
        let selectedCategory = await this.getOneBusinessCategory(businessId, categoryId);

        if (selectedCategory.error)  return this.returnMethod(500, false, "An error occurred from our end, kindly try again")

        let selectedSubcategories = selectedCategory.result.subcategories;

        if (selectedSubcategories.length == 1) {
            // delete category from db
            let deleteCategory = await this.deleteChoosenCategory(businessId, categoryId);

            if (deleteCategory.error) return this.returnMethod(500, false, "An error occurred from our end, kindly try again")

        } else {

            let newSubcategoryArray = [];

            for (let subcategory of selectedSubcategories) {
                if(subcategory.subcategory_id._id != subcategoryId) {
                    newSubcategoryArray.push(subcategory)
                }
            }

            // update category
            let newData = {subcategories: newSubcategoryArray};

            let updateCategory = await this.updateChoosenCategory(businessId, categoryId, newData);

            if (updateCategory.error == true ) return this.returnMethod(500, false, "An error occurred from our end, kindly try again");

        }

                // get all products in subcategory
        let allProducts = await this.productController.allProductsInSubcategory(businessId, subcategoryId);
        
        if (allProducts.error) return this.returnMethod(500, false, "An error occurred from our end, kindly try again")
        
        if (allProducts.result.length > 0) {

            allProducts.result.forEach(product => {
                product.images.forEach(async image => {
                    let publicID = `cudua_commerce/business/${businessId}/product/${image.split('.')[0]}`;
                    await this.removeFromCloudinary(publicID, 'image')
                    
                })
            }); 

            for (let product of allProducts.result) {
                // delete from cart
                await this.CartController.deleteProductById(product.id, businessId)

                // delete from saved items
                await this.SaveForLaterController.deleteProductById(product.id, businessId)

                // delete from order product
                await this.OrderController.deleteProductById(product.id, businessId);

                // delete from anonymous cart
                await this.AnonymousCartController.deleteProductById(product.id, businessId)
            }

        }

        // delete all products in subcategory

        let deleteAllProductsFromSubcategory = await this.productController.deleteAllProductsFromSubcategory(businessId, subcategoryId);

        if (deleteAllProductsFromSubcategory.error) return this.returnMethod(500, false, "We could not delete the products in this subcategory. Kindly try again")

        if (deleteAllProductsFromSubcategory.result == false) return this.returnMethod(200, false, "We could not delete the products in this subcategory. Kindly try again"); 


        return this.returnMethod(200, true, "Subcategory deleted successfully")


    }

}