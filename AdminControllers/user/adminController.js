'use-strict'

const AdminModel = require('../../Models/cudua-admins/AdminModel');
const FunctionRepo = require('../../Controllers/MainFunction');

module.exports = class AdminController extends FunctionRepo {
    constructor () {
        super()
    }

    async emailExists (email) {
        try {
            const findResult = await AdminModel.findOne({
                email: email
            });   

            return {
                error: false,
                result: findResult
            }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }


    async createAdminAccount (createAdmin) {
        try {

            const create = await createAdmin.save();
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