const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const BusinessModel = require('../../Models/BusinessModel');
const FunctionRepo = require('../MainFunction');

module.exports = class BusinessController extends FunctionRepo {

    constructor () {
        super();
    }

    async checkUsernameExists (username) {
        try {
            const findResult = await BusinessModel.findOne({
                username: username
            });   

            if (findResult._id) {
                return {
                    error: false,
                    result: true   
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

    async checkIfEmailExists(email) {
        try {
            const findResult = await BusinessModel.findOne({
                'contact.email': email
            });   

                if (findResult._id) {
                   return {
                       error: false,
                       result: true   
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
            const findResult = await BusinessModel.findOne({
                _id: businessId
            });   

            if (findResult._id) {
                return {
                    error: false,
                    result: findResult   
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

    async findOneAndUpdate(businessId, newDataObject) {
        try {
            let updateRecord = await BusinessModel.findOneAndUpdate({_id: businessId}, { $set:newDataObject }, {new : true });
            return {
                error: false,
                result: updateRecord
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async saveBusinessPhoneNumber(businessId, phoneNumber) {
        try {
            const findResult = await BusinessModel.findOne({
                _id: businessId
            }).exec();   

            findResult.contact.phone = []
            
            for(let number of phoneNumber) {
                findResult.contact.phone.push(number);
            }

            let saveData = await findResult.save();
            return {
                error: false,
                result: saveData
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

}