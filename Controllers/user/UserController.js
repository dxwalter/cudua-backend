const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserModel = require('../../Models/UserModel');

module.exports = class UserController {

    constructor () {
        
    }

    async findOneEmail(email) {
        try {
            let findResult = await UserModel.find({email: this.email}).limit(1).exec();   
            return findResult;
        } catch (error) {
            console.log(error)
        }
    }

    async emailExists (email) {
        try {
            const findResult = await UserModel.find({
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

}