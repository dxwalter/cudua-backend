"use-strict"

const FunctionRepository = require('../MainFunction');
const CuduaCustomersContactModel = require('../../Models/CuduaCustomersContact');

module.exports = class CuduaCustomerController extends FunctionRepository {

    constructor () {
        super();
    }

    async createData (name, type, location, phoneOne, phoneTwo) {
        
        let data = new CuduaCustomersContactModel({
            businessname: name,
            location: location,
            type: type,
            phone_one: phoneOne,
            phone_two: phoneTwo
        });

        try {
            
            let create = await data.save();

            return {
                result: create,
                error: false,
                countData: 0
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }

    }

    async getContactsByIndustry (industry, page) {
        
        try {
            
            let limit = 30;

            let getContact = await CuduaCustomersContactModel.find({type: industry})
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)

            return {
                error: false,
                result: getContact
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async getAllIdealContacts (page) {
        
        try {
            
            let limit = 30;

            let getContact = await CuduaCustomersContactModel.find()
            .sort({_id: -1})
            .limit(limit * 1)
            .skip((page - 1) * limit)

            return {
                error: false,
                result: getContact
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async countIdealCustomerMethod (industry) {
        try {
            let countData = await CuduaCustomersContactModel.countDocuments({type:industry});

            return {
                count: countData,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
} 