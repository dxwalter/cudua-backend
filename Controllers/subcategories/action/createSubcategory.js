"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let SubcategoryController = require('../SubcategoryController')
const Subcategory = require('../../../Models/Subcategory');


module.exports = class CreateCategory extends SubcategoryController {

    constructor (args) { 
        super(); 
        this.subcategories = args.subcategories; // this is an array of strings
        
        this.subcategoriesCount = this.subcategories.length; // the number of subcategories that was submitted
        this.subcategoriesExisting = 0; // the number of subcategories already existing
        this.subcategoriesAdded = 0; // the number of subcategories successfully added to the db

        this.categoryId = args.categoryId
    }

    
    returnMethod (code, success, message) {
        return {

            code: code,
            success: success,
            message: message
        }
    }

    async checkSubcategoryExists (name, categoryId) {

        let checkSubcategoryExistence = await this.checkExists(name, categoryId);

        if (checkSubcategoryExistence.error == true) {
            return this.returnMethod("", "", 500, false, `An error occurred: ${checkSubcategoryExistence.message}`);
        } else if (checkSubcategoryExistence.error == false && checkSubcategoryExistence.result == false) {
            this.subcategoriesExisting += 1;
            return true; 
        }

    }

    async validateInputSubcategory () {
        // validate 
        // check if category exist
        // add

        const subcategories = this.subcategories;
        const newSubcategoryArray = [];

        if (subcategories.length < 1) {
            return this.returnMethod("", "", 200, false,   `Enter one or more subcategories seperated by comma`);
        }

        for (const item of subcategories) {

            if (item.length > 2) {
                // check if exists 
                let callCheck = await this.checkSubcategoryExists(item, this.categoryId);
                // if callcheck is == true, it means the subcategory does not exist
                if (callCheck) {
                    let newObject = {"name": item};
                    newSubcategoryArray.push(newObject);
                    this.subcategoriesAdded = this.subcategoriesAdded + 1
                }
            }
            
        }
        
        console.log(newSubcategoryArray);

        return;

        if (this.name.length < 3) {
            return this.returnMethod("", "", 200, false, "Enter a valid subcategory name");
        }

        // // check if it exists   
        // let checkSubcategoryExistence = await this.checkSubcategoryExists(this.name);

        // if (checkSubcategoryExistence.error == true) {
        //     return this.returnMethod("", "", 500, false, `An error occurred: ${checkSubcategoryExistence.message}`);
        // } else if (checkSubcategoryExistence.error == false && checkSubcategoryExistence.result == true) {
        //     return this.returnMethod("", "", 200, false,   `The '${this.name}' subcategory  already exists`);
        // }

        // create
        const CreateCategory = new CategoryModel ({
            name : this.name
        });

        let data = await this.CreateCategory(CreateCategory);
        if (data.error == true) {
            return this.returnMethod('', '', false, `An error occurred: ${data.message}`,  200);
        }

        data = data.result;
        return this.returnMethod(data._id, this.MakeFirstLetterUpperCase(this.name), 202, true, "Category was added successfully. It will take 1 to 6 hours to be activated.")

    }

    async confirmCategory (categoryId) {
        

    }

    async getSubcategory (categoryId) {
        
    }

    async getSubcategories () {

    }

}