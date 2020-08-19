"use-strict";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = require('../UserController')
const UserModel = require('../../../Models/UserModel')    
const MoveToOnymousCart = require('../../anonymousCart/action/anonymousAddItemToCart');
const CreateNotification = require('../../notifications/action/createNotification')


const CreateUser = require('./CreateUser');
const CreateBusiness = require('../../business/action/createBusiness')


module.exports = class CreateUserAndBusiness extends UserController{

    constructor (args) {
        super();
        this.CreateUser = new CreateUser(args);
        this.CreateBusiness = new CreateBusiness(args);
    }

    returnData (userData, businessData, code, success, message) {
        return {
            userData: userData,
            businessDetails: businessData,
            code: code,
            success: success,
            message: message
        }
    }

    async create () {

        let createUser = await this.CreateUser.validateUserInput();

        if (createUser.success == false ) {
            return this.returnData(null, null, createUser.code, createUser.success, createUser.message)
        }

        createUser = createUser.userData;

        let userData = {
            fullname: createUser.fullname,
            email: createUser.email,
            businessId: createUser.businessId,
            userId: createUser.userId,
            accessToken: createUser.accessToken
        }

        // create business
        let createBusiness = await this.CreateBusiness.validateBusinessInput(createUser.userId);

        if (createBusiness.success == false) {
            // delete user
            this.deleteUserFromDB(createUser.userId)
            return this.returnData(null, null, createBusiness.code, createBusiness.success, createBusiness.message)
        }

        let business = createBusiness.businessDetails;

        console.log(business)

        userData.businessId = business.id;

        let businessData = {
            id: business.id,
            businessname: business.businessname,
            username: business.username,
            review: 0
        }

        return this.returnData(userData, businessData, createBusiness.code, createBusiness.success, createBusiness.message)

    }




}