const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserModel = require('../../Models/UserModel');
const RecoverPasswordModel = require('../../Models/RecoverPassword');
const FunctionRepo = require('../MainFunction');

module.exports = class UserController extends FunctionRepo{

    constructor () { super(); }

    async findOneEmail(email) {
        try {
            let findResult = await UserModel.find({email: this.email}).populate('business_details').limit(1).exec();   
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

    async findUserByEmail (email) {
        try {
            const findResult = await UserModel.find({
                email: email
            }).limit(1).exec();  
    
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

    async emailExists (email) {
        try {
            const findResult = await UserModel.find({
                email: email
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

    async checkRecoverySecret (secret) {
        try {
            const findResult = await RecoverPasswordModel.find({
                secret: secret
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

    async emailExistsInForgotPassword (email) {
        try {
            const findResult = await RecoverPasswordModel.find({
                email: email
            }).limit(1).exec();   
    
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                    return {
                        error: false,
                        result: false   
                    }
                }
            } else {
                return {
                    error: false,
                    result: true   
                }
            }
    
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async createUserAccount (createUser) {
        try {

            const create = await createUser.save();
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

    async findUsersById (userId) {
        try {
            const findResult = await UserModel.find({
                _id: userId
            }).limit(1).exec();  
            
            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return {
                       error: false,
                       result: findResult[0]
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

    async createForgotPassword (forgotPasswordData) {
        try {
            const create = await forgotPasswordData.save();
            return {
                result: create,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async deleteOneFromPasswordRecovery (userId) {
        let deleteRecord = await RecoverPasswordModel.findOneAndDelete({userId: userId})
    }

    async findOneAndUpdate(userId, newDataObject) {
        try {
            let updateRecord = await UserModel.findOneAndUpdate({_id: userId}, { $set:newDataObject }, {new : true });
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


}