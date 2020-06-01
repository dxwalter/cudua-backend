const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserModel = require('../../Models/UserModel');
const RecoverPasswordModel = require('../../Models/RecoverPassword');
const FunctionRepo = require('../MainFunction');

module.exports = class UserController extends FunctionRepo{

    constructor () { super(); }

    async findOneEmail(email) {
        try {
            let findResult = await UserModel.find({email: this.email}).limit(1).exec();   
            return findResult;
        } catch (error) {
            console.log(error);
        }
    }

    async findUserByEmail (email) {
        const findResult = await UserModel.find({
            email: email
        }).limit(1).exec();  

        return findResult;
    }

    async emailExists (email) {
        try {
            const findResult = await UserModel.find({
                email: email
            }).limit(1).exec();   
    
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return true;
                }
            } else {
                return false;
            }
    
        } catch (error) {
            console.log(error);
        }
    }

    async checkRecoverySecret (secret) {
        try {
            const findResult = await RecoverPasswordModel.find({
                secret: secret
            }).limit(1).exec();   
    
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return true;
                }
            } else {
                return false;
            }
    
        } catch (error) {
            console.log(error);
        }
    }

    async emailExistsInForgotPassword (email) {
        try {
            const findResult = await RecoverPasswordModel.find({
                email: email
            }).limit(1).exec();   
    
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return false;
                }
            } else {
                return true;
            }
    
        } catch (error) {
            console.log(error);
        }
    }

    async createUserAccount (createUser) {
        try {

            const create = await createUser.save();
            return create;

        } catch (error) {
            return this.returnMethod("", "", 0, "An error occured, please try again")
        }
    }

    async createForgotPassword (forgotPasswordData) {
        try {
            const create = await forgotPasswordData.save();
            return create;

        } catch (error) {
            return this.returnMethod("", "", 0, "An error occured, please try again")
        }
    }

    async deleteOneFromPasswordRecovery (userId) {
        let deleteRecord = await RecoverPasswordModel.findOneAndDelete({userId: userId})
    }

    async findOneAndUpdate(userId, newDataObject) {

        try {
            let updateRecord = await UserModel.findOneAndUpdate({_id: userId}, { $set:newDataObject }, {new : true });
            return updateRecord;
        } catch (error) {
            //
            console.log(error)
        }
    }


}