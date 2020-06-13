"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let CategoryController = require('../CategoryController');
const CategoryModel = require('../../../Models/Categories');


module.exports = class CreateCategory extends CategoryController {

    constructor (args) { 
        super(); 
        this.name = this.MakeFirstLetterUpperCase(args.categoryName);
    }

    
    returnMethod (categoryId, categoryName, code, success, message) {
        return {
            categoryId: categoryId,
            categoryName: categoryName,
            code: code,
            success: success,
            message: message
        }
    }

    async validateInput () {
        // validate 
        // check if category exist
        // add

        if (this.name.length < 3) {
            return this.returnMethod("", "", 200, false, "Enter a valid category name");
        }

        // check if it exists   
        let checkCategoryExistence = await this.checkCategoryExists(this.name);

        if (checkCategoryExistence.error == true) {
            return this.returnMethod("", "", 500, false, `An error occurred: ${checkCategoryExistence.message}`);
        } else if (checkCategoryExistence.error == false && checkCategoryExistence.result == true) {
            return this.returnMethod("", "", 200, false,   `The '${this.name}' category  already exists`);
        }

        // create
        const CreateCategory = new CategoryModel ({
            name : this.name
        });

        let data = await this.CreateCategory(CreateCategory);
        if (data.error == true) {
            return this.returnMethod('', '', false, `An error occurred: ${data.message}`,  200);
        }

        data = data.result;
        return this.returnMethod(data._id, this.MakeFirstLetterUpperCase(this.name), 202, true, "Category was added successfully. It will take 1 to 3 hours to be activated.")

    }

    async confirmCategory (categoryId) {
        

    }

    async getCategory (categoryId) {
        
    }

    async getCategories () {

    }

}