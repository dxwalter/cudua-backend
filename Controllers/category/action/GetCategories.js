
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
                category: null,
                code: 500,
                success: false,
                message: `An error occurred: Please try again` 
            }
        }
        
        if (data.result == false) {
            return {
                category: null,
                code: 500,
                success: false,
                message: `No category has been added` 
            }
        }

        let newDataArray = [];
        let resultArray = data.result;

        for (let [index, data] of resultArray.entries()) {
            newDataArray[index] = {
                id: data._id,
                name: data.name,
                subcategories: []
            }

            for (let [subcatIndex, subcatData] of data.subcategoryList.entries()) {
                if (subcatData.status == 1) {
                    newDataArray[index].subcategories.push({
                        subcategoryId: subcatData._id,
                        subcategoryName: subcatData.name
                    })  
                } 
            }
        }

        return {
            category: newDataArray,
            code: 200,
            success: true,
            message: `Categories successfully retrieved` 
        };
            

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

        for (let subcat of getCategory.subcategoryList) {
            if (subcat.status == 1) {
                category.subcategories.push({
                    subcategoryId: subcat._id,
                    subcategoryName: subcat.name
                })
            }
        }

        return {
            category: category,
            code: 200,
            success: true,
            message: `Category successfully retrieved` 
        }


    }
}