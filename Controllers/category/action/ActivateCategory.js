
"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let CategoryController = require('../CategoryController');
const CategoryModel = require('../../../Models/Categories');

module.exports = class ActivateCategory extends CategoryController {

    constructor () { super(); }

    async ActivateMethod (args) {

        let categoryId = args.categoryId;
        
        if (categoryId) {
            let activateCategory = await this.findOneAndUpdate(categoryId, {"status": 1});

            if (activateCategory.error == true) {
                return this.returnMethod(200, false, `An error occurred: ${activateCategory.message}.`);
            } 

            return  this.returnMethod(202, true, `${this.MakeFirstLetterUpperCase(activateCategory.result.name)} category has been activated`);

        } else {
            return this.returnMethod(200, false, "Choose a category to activated.")
        }
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

}