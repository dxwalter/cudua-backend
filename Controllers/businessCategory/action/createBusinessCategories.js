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
        let subcatStatus = 0;
        let oldSubcategories = [];

        // set old categories
        for (let oldSubcat of myCategoryData.result.subcategories) {
            oldSubcategories.push(oldSubcat.subcategory_id);
        }
       
        for (let newSubcatId of newSubcategoryArray) {
            
            for (let oldSubcatId of oldSubcategories) {
                if (newSubcatId == oldSubcatId) {
                    subcatStatus = 1;
                }
            }

            if (subcatStatus == 0) {
                if (this.checkIfSubcategoryExistsIncategory(newSubcatId, this.categorySubcategories)) {
                    readySubcategories.push(newSubcatId)
                }
            }

            subcatStatus = 0;

        }
        let uniqueArray = Array.from(new Set(readySubcategories))
        
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
        return false;
    }

    async ChooseCategory (businessId, categoryId, businessSubcategoriesList) {
        
        if (businessId.length == 0) {
            return this.returnMethod(200, false, "Your business details was not provided. Sign in and try again. If problem persists, contact the support team")
        }

        if (businessSubcategoriesList.length < 1) {
            return this.returnMethod(500, false, 'Please choose a subcategory');
        }

        // check if business exists
        let checkfiBusinessExists = await this.getBusinessData(businessId);

        // if error occurred
        if (checkfiBusinessExists.error == true) {
            return this.returnMethod(500, false, 'Your business account is not recognised');
        }

        // if business does not  exist
        if (checkfiBusinessExists.result ==  false) {
            return this.returnMethod(200, false, 'Your business account is not recognised');
        }

        // check if category exists in category document/table
        let checkIfCategoryExistInCategoryDoc = await this.CategoryController.checkCategoryExists({_id: categoryId, status: 1});


        if (checkIfCategoryExistInCategoryDoc.error == true) {
            //possible error is categoryId does not match in db
            return this.returnMethod(500, false, `An error occurred: This category has been moved or deleted`)
        }


        if (checkIfCategoryExistInCategoryDoc.result[0].subcategoryList == undefined) {
            //possible error is categoryId does not match in db
            return this.returnMethod(500, false, `An error occurred: This subcategory has been moved or deleted`)
        }


        if (checkIfCategoryExistInCategoryDoc.error == false && checkIfCategoryExistInCategoryDoc.result.length > 0) {
            this.categorySubcategories = checkIfCategoryExistInCategoryDoc.result[0].subcategoryList
        }

        // check if this category has been created by the business before now.
        let checkIfCategoryHasBeenChosenByBusiness = await this.checkChoosenCategoryExist(categoryId, businessId);
 
        
        if (checkIfCategoryHasBeenChosenByBusiness.error == true) {
            return this.returnMethod(500, false, `An error occurred: Do not worry, it was our fault`)
        }

        /**
         * Update subcategory if category has been added to a business before now
         */
        if (checkIfCategoryHasBeenChosenByBusiness.result._id.length > 0 && checkIfCategoryHasBeenChosenByBusiness.error == false) {
            // edit and add subacategory
            return await this.addNewSubcategory(businessId, categoryId, businessSubcategoriesList, checkIfCategoryHasBeenChosenByBusiness)
        }
        

        // check if selected subcategories exists
        let subcategoriesList = businessSubcategoriesList;
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

        if (categoryExists.error == false && categoryExists.result == false) return this.returnMethod(200, false, 'An error occurred. This category has either been moved or delete')

        if (categoryExists.result[0].subcategoryList == undefined) {
            //possible error is categoryId does not match in db
            return this.returnMethod(500, false, `An error occurred: This subcategory has been moved or deleted`)
        }

        let subcategoriesList = categoryExists.result[0].subcategoryList
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

            if (checkCategoryByBusiness.result == false) {
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