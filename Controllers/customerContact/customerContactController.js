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
                countData: await CuduaCustomersContactModel.countDocuments()
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }

    }
} 