"use-strict";

let BusinessCategoryController = require('../BusinessCategoryController')
let BusinessCategoryModel = require('../../../Models/BusinessCategory');

const CategoryController = require('../../category/CategoryController');
const SubcategoryController = require('../../subcategories/SubcategoryController');


module.exports = class ChooseCategory extends BusinessCategoryController {
    constructor () { 
        super(); 
        this.CategoryController = new CategoryController()
        this.SubcategoryController = new SubcategoryController()
        this.categorySubcategories = "";
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async createCategoryForBusiness(businessId, categoryId, passedSubcatgories) {

        const createBusinessCategory = new BusinessCategoryModel ({
            business_id: businessId,
            category_id: categoryId,
            subcategories: passedSubcatgories
        });

        let create = await this.createBusinessCategory(createBusinessCategory)
        
        if (create.error == true) {
            return this.returnMethod(500, false, "An error occured saving your category");
        }
        
        if (create.error == false) {
            return this.returnMethod(202, true, `Your category and subcategories were added successfully`);
        }
    }

    async addNewSubcategory(businessId, categoryId, newSubcategoryArray, myCategoryData) {
       
        let readySubcategories = [];
        let oldSubcategories = [];

        // set old categories
        for (let oldSubcat of myCategoryData.subcategories) {
            oldSubcategories.push(oldSubcat.subcategory_id.toString());
        }
       
        for (let newSubcatId of newSubcategoryArray) {
            if (this.checkIfSubcategoryExistsIncategory(newSubcatId, this.categorySubcategories)) {
                readySubcategories.push(newSubcatId)
            }
        }

        readySubcategories = readySubcategories.concat(oldSubcategories)
    
        let uniqueArray = Array.from(new Set(readySubcategories));

        if (uniqueArray.length == 0) {
            return this.returnMethod(200, false, "An error occurred. The subcategory you chose already exists. Choose a different subcategory.")
        }

        let updateData = await this.insertSubcategory(businessId, categoryId, uniqueArray);

        if (updateData.error == true) {
            return this.returnMethod(500, false, "An error occurred updating your subcategory.")
        }

        if (updateData.error == false) {
            if (uniqueArray.length > 1) {
                return this.returnMethod(200, true, "Your subcategories were added successfully.")
            } else {
                return this.returnMethod(200, true, "Your subcategory was added successfully.")
            }
        }
    }

    checkIfSubcategoryExistsIncategory(subcategoryId, subcategoryArray) {
        
        for (let subcategory of subcategoryArray) {
        
            if (subcategoryId == subcategory._id) {
                return true
            }
        }

        // it does not exist
        return false;
    }

    async ChooseCategory (businessId, categoryId, subcategoryList, userId) {
     
        if (businessId.length == 0) return this.returnMethod(200, false, "Your business details was not provided. Sign in and try again. If problem persists, contact the support team")
        if (categoryId.length == 0) return this.returnMethod(200, false, "Choose a business your business category");
        if (subcategoryList.length == 0) return this.returnMethod(200, false, "Choose one or more subacategories for your business");

        // check if business exists
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnMethod(200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return this.returnMethod(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        // check if category exists in category document/table
        let getCategoryDetails = await this.CategoryController.checkCategoryExists({_id: categoryId, status: 1});
        if (getCategoryDetails.error) return this.returnMethod(200, false, "An error occurred. This category has been moved or deleted");

        this.categorySubcategories = getCategoryDetails.result.subcategoryList

        // check if category exists in business
        let businessCategoryCheck = await this.checkChoosenCategoryExist(categoryId, businessId);

        if (businessCategoryCheck == true) return this.returnMethod(200, false, `An error from our end occurred. Please try again`)
        
        if (businessCategoryCheck.result != null) {
            // update
            return await this.addNewSubcategory(businessId, categoryId, subcategoryList, businessCategoryCheck.result)
        }

        //create
        let subcategoriesList = subcategoryList;

        let failedSubcategories = 0
        let passedSubcatgories = [];

        for (let subcategories of subcategoriesList) {
          
                // check if subcategory is valid. Check against subcategories in category
                let checkSubcatgoryExists = this.checkIfSubcategoryExistsIncategory(subcategories, this.categorySubcategories)

                if (checkSubcatgoryExists ==  true) {
                    passedSubcatgories.push({subcategory_id: subcategories})
                } else {
                    return this.returnMethod(200, false, `An error occurred. A subcategory you chose does not exist`)
                }
        }


        if (passedSubcatgories.length == 0) {
            if (failedSubcategories == 1) {
                return this.returnMethod(200, false, `An error occurred. The subcategory you chose already exists in your account`)
            }else if (failedSubcategories > 1) {
                return this.returnMethod(200, false, `An error occurred. ${failedSubcategories} subcategories you chose already exists in your account`)
            }
            return this.returnMethod(200, false, "No category and subcategory was added to your business.")
        }


        // create
        return await this.createCategoryForBusiness(businessId, categoryId, passedSubcatgories)


    }   

    // this is used by product upload
    async addASingleCategoryOrSubcategory(businessId, category, subcategory) {

        // check if category exists in category document/table
        let categoryExists = await this.CategoryController.checkCategoryExists({_id: category, status: 1});
  
        if (categoryExists.error == true) {
            return this.returnMethod(200, false, 'An error occurred. This category has either been moved or delete')
        }

        if (categoryExists.error == false && categoryExists.result == false) return this.returnMethod(200, false, 'An error occurred. This category has either been moved or delete');

        if (categoryExists.result == null) {
            //possible error if categoryId does not match in db
            return this.returnMethod(500, false, `An error occurred: This subcategory has been moved or deleted`)
        }

        let subcategoriesList = categoryExists.result.subcategoryList
        let subcatCheck = 0;

        // check if subcategory exists in category
        for (let subcat of subcategoriesList) {
            if (subcategory == subcat._id) subcatCheck = 1
        }
        
        if (subcatCheck == 0) {
            return this.returnMethod(200, false, 'An error occurred. This subcategory has either been moved or delete')
        }


        // check if category has been choosen by business
        let checkCategoryByBusiness = await this.checkChoosenCategoryExist(category, businessId);
   
        if (checkCategoryByBusiness.error == false ) {

            if (checkCategoryByBusiness.result == null) {
                return await this.createCategoryForBusiness(businessId, category, [{subcategory_id: subcategory}])
            }
        }
        
        if (checkCategoryByBusiness.error == true) return this.returnMethod(200, false, 'An error occurred while checking if this category has been added to your business')


        let selectedBusinessSubcat = checkCategoryByBusiness.result.subcategories
        subcatCheck = 0;
        for (let subcat of selectedBusinessSubcat) {
            if (subcategory == subcat.subcategory_id) subcatCheck = 1
        }

        if (subcatCheck == 1) return this.returnMethod(200, true, 'This category and subcategory has been added to your account')

        let updateData = await  this.insertSubcategory(businessId, category, [subcategory]);

        if (updateData.error == true) return this.returnMethod(500, false, "An error occurred updating your subcategory.")

        if (updateData.error == false) return this.returnMethod(200, true, "Your subcategory was added successfully.")

    }
}