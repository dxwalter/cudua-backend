"use-strict";

const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

let UserController = require('../UserController');
let UserModel = require('../../../Models/UserModel');
let BusinessController = require('../../business/BusinessController');
let BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');

module.exports = class LoginUser extends UserController{

    constructor (args) {
        super();
        this.email = args.email.toLowerCase();
        this.password = args.password.toLowerCase();
        this.model = UserModel;
        this.BusinessController = new BusinessController();
        this.BusinessCategoryInstance = new BusinessCategoryController();
    }

    returnType (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async comparePassword (password) {
        try {
            let compare = await bcrypt.compare(this.password, password);
            return {
                error: false,
                result: compare
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    formatBusinessCategoryData(dataArray) {


        let businessCategoryArray = [];
        let categoryCount = 0; // 

        // retrieve category data
        for (const [categoryIndex, category] of dataArray.entries()) {
            let arr = category;
            let categoryDetails = category.category_id
            let subcategoriesList = category.subcategories;


            let newData = {
                id: arr._id,
                categoryId: categoryDetails._id,
                hide: arr.hide,
                categoryName: categoryDetails.name,
                subcategories: []
            }

            //retrieve subcategory data from subcategory array
            for (const [subcategoryIndex, subcategories] of subcategoriesList.entries()) {
                let subcategoryDetails = subcategories.subcategory_id
                newData.subcategories.push({
                    itemId: subcategories._id,
                    hide: subcategories.hide,
                    subcategoryId: subcategoryDetails._id,
                    subcategoryName: subcategoryDetails.name
                })
            }

            businessCategoryArray[categoryCount] = newData;
            
            categoryCount = categoryCount + 1;

        }

        return businessCategoryArray;
    }

    async getBusinessDetails (businessDetails) {

            
            // business data
            let getBusinessData = businessDetails

            // business address
            let businessAddress = {
                number: getBusinessData.address.number,
                street: getBusinessData.address.street,
                community: getBusinessData.address.community,
                lga: getBusinessData.address.lga,
                state: getBusinessData.address.state,
                country: getBusinessData.address.country
            }

            let businessId = getBusinessData._id;

            let businessCategories = await this.BusinessCategoryInstance.getbusinessCategories(businessId);
        
            if (businessCategories.error == true) {
                return this.returnType(500 , false, 'An error occurred while retrieving your business category')
            }

            if (businessCategories.error == false && businessCategories.result == false ) {
                businessCategories = null;
            } else {
                // this is the array of business categories and subcategories chosen by this business owner
                businessCategories = this.formatBusinessCategoryData(businessCategories.result);
            }

            // business contact
            let businessContact =  {
                email: getBusinessData.contact.email,
                phone: getBusinessData.contact.phone,
                whatsapp: {
                    status: getBusinessData.contact.whatsapp.status,
                    number: getBusinessData.contact.whatsapp.number
                }
            }
            
            // Business data including address and contact put together
            return {
                id: getBusinessData._id,
                businessname: getBusinessData.businessname,
                username: getBusinessData.username,
                description: getBusinessData.description,
                address: businessAddress,
                contact: businessContact,
                logo: getBusinessData.logo,
                businessCategories: businessCategories
            }


    }

    async AuthenticateUser () {

        if (this.email.length && this.password.length) {

                let findEmail = await this.findOneEmail(this.email);

                if (findEmail.error == true) {
                    return this.returnType(200 , false, findEmail.message)
                }
    
                findEmail = findEmail.result;

                if (findEmail.length > 0) {
                    
                    let userDbDetails = findEmail[0];
                    let userId = userDbDetails._id
                    let dbPassword = userDbDetails.password;

                    
                    
                    
                    let comparePassword = await this.comparePassword(dbPassword)
                    if (comparePassword.error == true) {
                        return this.returnType(200 , false, comparePassword.message)
                    }

                    comparePassword = comparePassword.result
                    if (comparePassword == true) {
                        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '24h' });

                        let businessDetails = userDbDetails.business_details;

                        let businessData = "";
                        let businessId = "";

                        if (businessDetails == undefined || businessDetails == null) {
                            businessData = null
                            businessId = null
                        } else {
                            businessData = await this.getBusinessDetails(businessDetails);
                            businessId = businessDetails._id
                        }


                        return {
                            // user object
                            userDetails: {
                                userId : userDbDetails._id,
                                fullname: userDbDetails.fullname,
                                email: userDbDetails.email,
                                phone: "",
                                displaPicture: "",
                                businessId: businessId,
                            },
                            // business details
                            businessDetails: businessData,
                            accessToken: accessToken,
                            code: 200,
                            success: true,
                            message: "Hurray! Your sign in was successfully"
                        };
                    } else {
                       return this.returnType(200 , false, `Your sign in details is incorrect`)
                    }
                    
                } else {
                    return this.returnType(200 , false, `Your sign in details is incorrect`)
                }

        } else {
            
            return this.returnType(200 , false, `Your email address and password is required to let you in`)
        }
    }

}