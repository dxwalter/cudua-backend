"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let BusinessCategoryController = require('../BusinessCategoryController')
let BusinessCategoryModel = require('../../../Models/BusinessCategory');

const CategoryController = require('../../category/CategoryController');
const SubcategoryController = require('../../subcategories/SubcategoryController');


module.exports = class ChooseCategory extends BusinessCategoryController {
    constructor () { 
        super(); 
        this.CategoryController = new CategoryController()
        this.SubcategoryController = new SubcategoryController()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async ChooseCategory (businessId, categoryId, subcategories) {
        
        if (businessId.length == 0) {
            return this.returnMethod(200, false, "Your business details was not provided. Sign in and try again. If problem persists, contact the support team")
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
        let checkIfCategoryExistInCategoryDoc = await this.CategoryController.checkCategoryExists({_id: categoryId});

        if (checkIfCategoryExistInCategoryDoc.error == true) {
            //possible error is categoryId does not match in db
            return this.returnMethod(500, false, `An error occurred: This category has been moved or deleted`)
        }

        if (checkIfCategoryExistInCategoryDoc.error == false && checkIfCategoryExistInCategoryDoc.result == true) {
            return this.returnMethod(200, false, `This category exists in your account. You can add or remove subcategories from this category`)
        }
        

        // check if this category has been created by the business before now.
        let checkIfCategoryHasBeenChosenByBusiness = await this.checkChoosenCategoryExist(categoryId, businessId);
        
        if (checkIfCategoryHasBeenChosenByBusiness.error == true) {
            return this.returnMethod(500, false, `An error occurred: Do not worry, it was our fault`)
        }

        if (checkIfCategoryHasBeenChosenByBusiness.error == false && checkIfCategoryHasBeenChosenByBusiness.result == true) {
            return this.returnMethod(200, false, `This category exists in your account. You can add or remove subcategories from this category`)
        }

        // check if selected subcategories exists
        let subcategoriesList = subcategories;
        let failedSubcategories = 0
        let passedSubcatgories = [];
        let arrayInitial = 0

        for (let subcategories of subcategoriesList) {
            if (subcategories.length) {
                // check if exists in subcategory doc
                // if exists, populate passedSubcatgories

                let checkSubcatgoryExists = await this.SubcategoryController.checkExists({_id: subcategories}, categoryId)
                
                if (checkSubcatgoryExists.error == true) {
                    return this.returnMethod(500, false, `An error occurred: This subcategory has beem moved or deleted`);
                }

                if (checkSubcatgoryExists.error == false && checkSubcatgoryExists.result == true) {

                    passedSubcatgories[arrayInitial] = {subcategory_id: subcategories.toString()}

                } else {
                    failedSubcategories = failedSubcategories + 1
                }

                arrayInitial = arrayInitial + 1;

            } else {
                failedSubcategories = failedSubcategories + 1;
            }
        }

        if (passedSubcatgories.length == 0) {
            return this.returnMethod(200, false, "No category or subcategory was added to your business.")
        }

        // create
        const createBusinessCategory = new BusinessCategoryModel ({
            business_id: businessId,
            category_id: categoryId,
            subcategory: passedSubcatgories
        });

        let create = await this.createBusinessCategory(createBusinessCategory)
        
        if (create.error == true) {
            return this.returnMethod(500, false, "An error occured saving your category");
        }
        
        if (create.error == false) {
            return this.returnMethod(202, true, `Your category and subcategories were added successfully`);
        }
        
    }   
}