'use-strict'

const BusinessModel = require('../../Models/BusinessModel');
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

}