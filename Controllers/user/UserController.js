'use-strict'

const UserModel = require('../../Models/UserModel');
const RecoverPasswordModel = require('../../Models/RecoverPassword');
const FunctionRepo = require('../MainFunction');

module.exports = class UserController extends FunctionRepo{

    constructor () { super(); }


    async countAllCustomersInCudua () {
        try {
            let countResult = await UserModel.countDocuments();
            return countResult
        } catch (error) {
            return 0;
        }
    }

    async findOneEmail(email) {
        try {
            let findResult = await UserModel.findOne({email: this.email})
            .populate('address.street')
            .populate('address.community')
            .populate('address.lga')
            .populate('address.state')
            .populate('address.country')
            .populate('business_details')
            .exec();   
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
            const findResult = await UserModel.findOne({
                email: email
            })
            .populate('address.street')
            .populate('address.community')
            .populate('address.lga')
            .populate('address.state')
            .populate('address.country')
            .exec();  
    
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
            const findResult = await UserModel.findOne({
                email: email
            })
            .populate('address.street')
            .populate('address.community')
            .populate('address.lga')
            .populate('address.state')
            .populate('address.country')
            .exec();   

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

    async checkRecoverySecret (secret, userId) {
        try {
            const findResult = await RecoverPasswordModel.findOne({
                $and: [
                    {
                        userId: userId, 
                        secret: secret
                    }
                ]
            }).exec();   
    
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

    async emailExistsInForgotPassword (email) {
        try {
            const findResult = await RecoverPasswordModel.findOne({
                email: email
            }).exec();   
    
            
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
            const findResult = await UserModel.findOne({
                _id: userId
            })
            .populate('address.street')
            .populate('address.community')
            .populate('address.lga')
            .populate('address.state')
            .populate('address.country')
            .exec();  
            
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

    async findUsersByField (fieldAndDataObject) {
        try {
            const findResult = await UserModel.findOne(fieldAndDataObject)
            .populate('address.street')
            .populate('address.community')
            .populate('address.lga')
            .populate('address.state')
            .populate('address.country')
            .exec();  
            
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


    async deleteUserFromDB(userId) {
        try {
            await UserModel.findOneAndDelete({_id: userId})   
        } catch (error) {
            
        }
    }

}