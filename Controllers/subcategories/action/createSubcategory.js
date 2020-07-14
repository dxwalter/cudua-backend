"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let SubcategoryController = require('../SubcategoryController')
const Subcategory = require('../../../Models/Subcategory');


module.exports = class CreateSubategory extends SubcategoryController {

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
        } else if (checkSubcategoryExistence.result == false) {
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

        if (subcategories[0].length < 1) {
            return this.returnMethod(200, false,   `Enter one or more subcategories seperated by comma`);
        }

        for (let item of subcategories) {

            item = this.MakeFirstLetterUpperCase(item)

            if (item.length > 2) {
                // check if exists 
                let callCheck = await this.checkSubcategoryExists({name: item}, this.categoryId);
                // if callcheck is == true, it means the subcategory does not exist
                if (callCheck) {
                    let newObject = {"name": item, "category_id": this.categoryId};
                    newSubcategoryArray.push(newObject);
                    this.subcategoriesAdded = this.subcategoriesAdded + 1
                }
            }
            
        }
        
        if (newSubcategoryArray.length == 0) {
            return this.returnMethod(200, false, 'The subcategories you added already exists')
        }

        let createSubcategory = await this.createSubcategories(newSubcategoryArray);

        if (createSubcategory.error == false) {

            let firstMessage = this.subcategoriesCount == 1 ? `You submitted one subcategory` : `You submitted ${this.subcategoriesCount} subcategories`;

            let secondMessage = this.subcategoriesAdded == 1 ? `one of them was added successfully` : `${this.subcategoriesAdded} of them were added successfully`;

            return this.returnMethod(202, true, `${firstMessage}, and ${secondMessage}. It will take 1 to 3 hours for them to be activated.`);

        } else {
            return this.returnMethod(200, false, `An error occurred: ${createSubcategory.message}`)
        }

    }

    async confirmCategory (categoryId) {
        

    }

    async getSubcategory (categoryId) {
        
    }

    async getSubcategories () {

    }

}