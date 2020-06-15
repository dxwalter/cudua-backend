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
        let subCategoryCount = 0;
        let subCategoryNameCount = 0;


        // retrieve category data
        for (let category of dataArray) {
            let arr = dataArray[categoryCount];

            let newData = {
                id: arr._id,
                categoryId: arr.category_id,
                hide: arr.hide,
                categoryName: arr.categoryList[0].name,
                subcategories: []
            }

            //retrieve subcategory data from subcategory array
            for (let subcategories of arr.subcategory) {
                console.log(subcategories)
                newData.subcategories[subCategoryCount] = {
                    itemId: subcategories._id,
                    hide: subcategories.hide,
                    subcategoryId: subcategories.subcategory_id,
                    subcategoryName: ""
                }
                subCategoryCount = subCategoryCount + 1;
            }

            // retrieve name of subcategory from subcategoryList array
            for(let subcateName of arr.subcategoryList) {
                newData.subcategories[subCategoryNameCount].subcategoryName = subcateName.name
                subCategoryNameCount = subCategoryNameCount + 1;
            }

            businessCategoryArray[categoryCount] = newData;
            
            categoryCount = categoryCount + 1;
            subCategoryCount = 0;
            subCategoryNameCount = 0;
        }

        return businessCategoryArray;
    }

    async getBusinessDetails (businessId) {

        // get business data
        let getBusinessData = await this.BusinessController.getBusinessData(businessId);

        if (getBusinessData.error == false && getBusinessData.result != false) {
            
            // business data
            getBusinessData = getBusinessData.result;

            // business address
            let businessAddress = {
                number: getBusinessData.address.number,
                street: getBusinessData.address.street,
                community: getBusinessData.address.community,
                lga: getBusinessData.address.lga,
                state: getBusinessData.address.state,
                country: getBusinessData.address.country
            }

            let businessCategory = await this.BusinessCategoryInstance.getbusinessCategories(businessId);
            if (businessCategory.error == true) {
                return this.returnType(500 , false, 'An error occurred while retrieving your business category')
            }

            if (businessCategory.error == false && businessCategory.result == false ) {
                businessCategory = '';
            } else {
                // this is the array of business categories and subcategories chosen by this business owner
                businessCategory = this.formatBusinessCategoryData(businessCategory.result);
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
                businesscategory: businessCategory
            }
        } else {
            return "";
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

                        let businessId = userDbDetails.business_id;

                        // get business details
                        let businessData = businessId.length > 0 ? await this.getBusinessDetails(businessId) : "";


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