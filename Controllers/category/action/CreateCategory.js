"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let CategoryController = require('../CategoryController');
const NewCategories = require('../../../Models/NewCategories');


module.exports = class CreateCategory extends CategoryController {

    constructor () { 
        super(); 
    }

    
    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async createNewCategory (categoryName, subcategories, userId) {
        // validate 
        // check if category exist
        // add



        if (categoryName.length < 3) {
            return this.returnMethod(200, false, "Enter a valid category name");
        }

        if (subcategories.length < 3) {
            return this.returnMethod(200, false, "Type one or multiple subcatgories seperated by comma");
        }

        // check if it exists   


        // create
        const CreateCategory = new NewCategories ({
            name : categoryName,
            author: userId,
            subcategories: subcategories
        });

        let data = await this.CreateNewCategory(CreateCategory);

        if (data.error) return this.returnMethod(500, false, "An error occurred from our end. Kindly try again");

        return this.returnMethod(200, true, `"${categoryName}" has been saved and currently undergoing review and be up in 60 minutes`);


    }

    async createNewSubcategory (categoryId, subcategories, userId) {
        console.log(categoryId)
        console.log(subcategories)
        console.log(userId)
    }

    async getCategory (categoryId) {
        
    }

    async getCategories () {

    }

}