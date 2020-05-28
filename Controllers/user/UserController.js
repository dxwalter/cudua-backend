const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserModel = require('../../Models/UserModel');

module.exports = class UserController {

    constructor () {
        
    }

    async emailExists () {
        try {
            const findResult = await this.model.find({
                email: this.email
            }).limit(1).exec();   

            if (findResult.length > 0) {
                if (findResult[0]._id) {
                   return false;
                }
            }
    
        } catch (error) {
            console.log(error);
        }
    }

}