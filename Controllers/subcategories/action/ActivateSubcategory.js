
"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let SubcategoryController = require('../SubcategoryController');

module.exports = class ActivateSubcategory extends SubcategoryController {

    constructor () { super(); }

    async ActivateMethod (args) {
    
        let subcategoryId = args.subcategoryId;
        
        if (subcategoryId) {

            let activateSubcategory = await this.findOneAndUpdate(subcategoryId, {"status": 1});

            if (activateSubcategory.error == true) {
                return this.returnMethod(200, false, `An error occurred: ${activateSubcategory.message}.`);
            }

            if (activateSubcategory.error == false && activateSubcategory.result == false) {
                return this.returnMethod(200, false, `An error occurred: You entered a wrong input. Refresh page and try again`);
            }

            return  this.returnMethod(202, true, `${this.MakeFirstLetterUpperCase(activateSubcategory.result.name)} subcategory has been activated`);

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