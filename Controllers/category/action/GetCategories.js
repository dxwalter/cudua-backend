
"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let CategoryController = require('../CategoryController');
const { request } = require('http');
const Categories = require('../../../Models/Categories');

module.exports = class AllCategories extends CategoryController {

    constructor () { super(); }

    async GetAll () {
        let data = await this.GetAllCategories();
        if (data.error == true) {
            return {
                category: [],
                code: 500,
                success: false,
                message: `An error occurred: ${data.message}` 
            }
        } else {
            if (data.result == false) {
                return {
                    category: [],
                    code: 500,
                    success: false,
                    message: `No category has been added` 
                }
            } else {
                let newDataArray = [];
                let resultArray = data.result;

                let categoryCount = 0;

                for (let item of resultArray) {
                    
                    // populate category
                    let category = {
                        id: item._id,
                        name: item.name, 
                        subcategories: []
                    }

                    // populate subcategories
                    let subcategoriesCount = 0;

                    for (let subcategoriesListing of item.subcategoryList) {

                        category.subcategories[subcategoriesCount] = {
                            subcategoryId: subcategoriesListing.id,
                            subcategoryName: subcategoriesListing.name
                        }

                        subcategoriesCount = subcategoriesCount + 1;
                    }

                    // update array
                    newDataArray[categoryCount] = category;

                    categoryCount = categoryCount + 1;
                }

                return {
                    category: newDataArray,
                    code: 200,
                    success: true,
                    message: `Categories successfully retrieved` 
                };
                
            }
        }
    }

    async GetOne(args) {
        let categoryId = args.categoryId;

        if (categoryId.length == 0) {
            return {
                category: [],
                code: 200,
                success: false,
                message: `Choose a category` 
            }
        }

        let getCategory = await this.GetOneCategory(categoryId);

        if (getCategory.error == true) {
            return {
                category: [],
                code:500,
                success: false,
                message: `An error occurred: ${getCategory.message}` 
            }
        }

        if (getCategory.result == false) {
            return {
                category: [],
                code: 200,
                success: true,
                message: `No category was found` 
            }
        }

        getCategory = getCategory.result[0];

        let category = {
            id: getCategory._id,
            name: getCategory.name, 
            subcategories: []
        }

        
        // populate subcategories
        let subcategoriesCount = 0;
        

        for (let subcategories of getCategory.subcategoryList) {
            category.subcategories[subcategoriesCount] = {
                subcategoryId: subcategories._id,
                subcategoryName: subcategories.name
            }
            subcategoriesCount = subcategoriesCount + 1;
        }

        return {
            category: category,
            code: 200,
            success: true,
            message: `Category successfully retrieved` 
        }


    }
}