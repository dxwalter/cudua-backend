'use-strict'

const AccountingModel = require('../../Models/AccountingModel');
const FunctionRepo = require('../MainFunction');

module.exports = class AccountingController extends FunctionRepo {
    constructor () {
        super()
    }

    async createAccountingRecord (data) {
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

    async getAllBusinessTransactions (businessId) {
        
        try {
            let getItems = await AccountingModel.find({business: businessId})
            .populate("userId")

            return {
                error: false,
                result: getItems
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

}