"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let CategoryController = require('../../category/CategoryController')
const Subcategory = require('../../../Models/Subcategory');


module.exports = class CreateCategory extends CategoryController {

    constructor (args) { 
        super(); 
        this.subcategories = args.subcategories; // this is an array of strings
        
        this.subcategoriesCount = this.subcategories.length; // the number of subcategories that was submitted
        this.subcategoriesExisting = 0; // the number of subcategories already existing
        this.subcategoriesAdded = 0; // the number of subcategories successfully added to the db

        this.categoryId = args.categoryId

        this.categorySubcategory;
    }

    
    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    checkSubcategoryExists (subcategoryName, subcategoryList) {

        if (subcategoryList.length > 0) {
            for (let subData of subcategoryList) {
                if (subcategoryName.toLowerCase()  == subData.name.toLowerCase()) {
                    this.subcategoriesExisting += 1;
                    return false
                }
            }
            return true
        } else {
            return true
        }

    }

    async validateInputSubcategory () {
        // validate 
        // check if category exist
        // add

        const subcategories = this.subcategories;
        const categoryId = this.categoryId;
        const newSubcategoryArray = [];

        if (categoryId.length < 2) {
            return this.returnMethod(200, false,   `Choose a category`);
        }


        if (subcategories.length < 1 || subcategories[0].length < 1) {
            return this.returnMethod(200, false,   `Enter one or more subcategories seperated by comma`);
        }

        // get category details
        let getCategoryDetails = await this.GetOneCategory(categoryId);
        if (getCategoryDetails.error == true) {
            return this.returnMethod(500, false, `An error occurred. Please refresh the page and try again`);
        }

        if (getCategoryDetails.result.length > 0) {
            this.categorySubcategory = getCategoryDetails.result[0].subcategories;
        } else {
            return this.returnMethod(200, false, 'An error occurred. The selected category has been deleted or being moved')
        }

        for (let item of subcategories) {

            item = this.MakeFirstLetterUpperCase(item)

            if (item.length > 2) {
                // check if exists 
                let callCheck = this.checkSubcategoryExists(item, this.categorySubcategory);
                console.log(callCheck)
                // if callcheck is == true, it means the subcategory does not exist
                if (callCheck) {
                    let newObject = {"name": item};
                    newSubcategoryArray.push(newObject);
                    this.subcategoriesAdded = this.subcategoriesAdded + 1
                }

            }
            
        }
        
        if (newSubcategoryArray.length == 0) {
            return this.returnMethod(200, false, 'The subcategory(s) you added already exists')
        }


        let createSubcategory = await this.createNewSubcategory(categoryId, newSubcategoryArray)


        if (createSubcategory.error == false) {

            let firstMessage = this.subcategoriesCount == 1 ? `You submitted one subcategory` : `You submitted ${this.subcategoriesCount} subcategories`;

            let secondMessage = this.subcategoriesAdded == 1 ? `one of them was added successfully` : `${this.subcategoriesAdded} of them were added successfully`;

            return this.returnMethod(202, true, `${firstMessage}, and ${secondMessage}. It will take 1 to 3 hours for them to be activated.`);

        } else {
            return this.returnMethod(200, false, `An error occurred and it is our fault. Refresh and try again`)
        }

    }

    async confirmCategory (categoryId) {
        

    }

    async getSubcategory (categoryId) {
        
    }

    async getSubcategories () {

    }

}