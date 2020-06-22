"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const SubcategoryController = require('../../subcategories/SubcategoryController');
const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');

module.exports = class HideBusinessSubcategory extends SubcategoryController {
    constructor () {
        super();
        this.businessCategoryController = new BusinessCategoryController();
    }

    async showSubcategory (businessId, categoryId, subcategoryId) {
        // note that documentI is the _id from business-category collection
        if (businessId.length < 1 || categoryId.length < 1, subcategoryId.length < 1) {
            return {
                code: 200, 
                success: false,
                message: "The right credential was not provided for this operation. Kindly refresh the page and try again"
            }
        }

        let showMyBusinessSubcategory = await this.businessCategoryController.hideAndShowSubcategory(businessId, categoryId, subcategoryId, "show");

        if (showMyBusinessSubcategory.error == true) {
            return {
                code: 500,
                success: false,
                message: "An error occurred making your subcategory visible to your customers. This was caused by a wrong input or a technical glitch"
            }
        }

        if (showMyBusinessSubcategory.error == false && showMyBusinessSubcategory.result == false) {
            return {
                code: 200,
                success: false,
                message: "An error occurred making your subcategory visible to your customers and it was our fault. Please kindly retry the process"
            }
        }


        if (showMyBusinessSubcategory.error == false && showMyBusinessSubcategory.result == true) {

            return {
                code: 200,
                success: true,
                message: `Your subcategory is now visible to your customers`
            }

        }

    }
}