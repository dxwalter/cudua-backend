
"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let CategoryController = require('../../category/CategoryController');

module.exports = class ActivateSubcategory extends CategoryController {

    constructor () { super(); }

    async ActivateMethod (args) {


    
        let subcategoryId = args.subcategoryId;
        let categoryId = args.categoryId
        
        if (subcategoryId && categoryId) {

            let activateSubcategory = await this.subcategoryActivation(categoryId, subcategoryId);

            if (activateSubcategory.error == true) {
                return this.returnMethod(200, false, `An error occurred. Please try again`);
            }

            if (activateSubcategory.error == false && activateSubcategory.result == false) {
                return this.returnMethod(200, false, `An error occurred: You entered a wrong input. Refresh page and try again`);
            }

            return  this.returnMethod(202, true, `${this.MakeFirstLetterUpperCase(activateSubcategory.result)} subcategory has been activated`);

        } else {
            return this.returnMethod(200, false, "Choose a subcategory to be activated.")
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