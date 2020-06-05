const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const BusinessModel = require('../../Models/BusinessModel');
const UserModel = require('../../Models/UserModel');
const FunctionRepo = require('../MainFunction');

module.exports = class BusinessController extends FunctionRepo {

    constructor () {
        super();
    }

    async checkUsernameExists (username) {
        try {
            const findResult = await BusinessModel.find({
                username: username
            }).limit(1).exec();   
    
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return {
                       error: false,
                       result: true   
                   }
                }
            } else {
                return {
                    error: false,
                    result: false   
                }
            }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async createBusinessAccount (data, userId) {
        
        try {
            const create = await data.save();
            return {
                error: false,
                result: create
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async getBusinessData (businessId) {
        try {
            const findResult = await BusinessModel.find({
                _id: businessId
            }).limit(1).exec();   
    
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return {
                       error: false,
                       result: findResult[0]   
                   }
                }
            } 

            return {
                error: false,
                result: false   
            }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
}