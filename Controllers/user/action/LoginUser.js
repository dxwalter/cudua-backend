"use-strict";

const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

let UserController = require('../UserController')
let UserModel = require('../../../Models/UserModel')

module.exports = class LoginUser extends UserController{

    constructor (args) {
        super();
        this.email = args.email.toLowerCase();
        this.password = args.password.toLowerCase();
        this.model = UserModel;
    }

    returnType (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async comparePassword (password) {
        return bcrypt.compare(this.password, password);
    }

    async AuthenticateUser () {

        if (this.email.length && this.password.length) {

                let findEmail = await this.findOneEmail(this.email);
    
                if (findEmail.length > 0) {
                    
                    let userDetails = findEmail[0];
                    let userId = userDetails._id
                    let dbPassword = userDetails.password;
                    
                    let comparePassword = await this.comparePassword(dbPassword)
                    
                    if (comparePassword == true) {
                        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '24h' });
                        return {
                            userId : userDetails._id,
                            fullname: userDetails.fullname,
                            email: userDetails.email,
                            phone: "",
                            displaPicture: "",
                            businessId: "",
                            accessToken: accessToken,
                            code: 200,
                            success: true,
                            message: "Hurray! Your sign in was successfully"
                        };
                    } else {
                       return this.returnType(200 , false, `Your sign in details is incorrect`)
                    }
                    
                } else {
                  
                    return this.returnType(200 , false, `Your sign in details is incorrect`)
                    
                }

        } else {
            
            return this.returnType(200 , false, `Your email address and password is required to let you in`)
        }
    }

}