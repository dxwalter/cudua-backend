"use-strict";

const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

let UserController = require('../UserController');
let UserModel = require('../../../Models/UserModel');
let RecoverPasswordModel = require('../../../Models/RecoverPassword')

module.exports = class RecoverPassword extends UserController{

    constructor () {
        super();
    }

    returnType (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async recoverPasswordCheck (args) {
        
        this.email = args.email;

        // check if email exists in db
        let checkEmailExist = await this.emailExists(this.email);

        if (checkEmailExist) {
            
            let userDetails = await this.findUserByEmail(this.email);
            let userId = userDetails[0]._id;

            let checkEmailExistInRecovery = await this.emailExistsInForgotPassword(this.email);
           
            if (checkEmailExistInRecovery) {
                this.deleteOneFromPasswordRecovery(userId);
            }

            // generate secret key
            let secret = Math.floor(Math.random()*90000) + 10000;

            // insert
            const insertForgotPassword = new RecoverPasswordModel ({
                userId: userId,
                secret: secret
            });

            let createForgotPassword = await this.createForgotPassword(insertForgotPassword);

            if(createForgotPassword._id) {

                let emailObject = {
                    to: this.email,
                    from: 'test@example.com',
                    subject: 'Sending with Twilio SendGrid is Fun',
                    text: 'and easy to do anywhere, even with Node.js',
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                }

                // send mail
                console.log(this.sendEmail(emailObject));

                return this.returnType(200 , true, `A password recovery message has been sent to you ${this.email}`)
            } else {
                return this.returnType(200 , false, `An error occured`)
            }

        } else {
            return this.returnType(200 , false, `Your email address is not recognised`);
        }
    

        // Check if customer data exists in forgot password db
        // send email
    }

    async createNewPassword(args) {
        this.password = args.password
        this.secret = args.secret;
        this.userId = args.userId;

        if (this.secret && await this.checkRecoverySecret(this.secret)) {
            
            if (this.password.length < 6) {

                return this.returnType(200 , false, `Your email address is not recognised`);

            } else {
                this.password = bcrypt.hashSync(this.password, 10);
            }
                
            // update 
            let newData = {
                password: this.password
            };

            let changePassword = await this.findOneAndUpdate(this.userId, newData);
            
            if (changePassword) {

                // delete from  recoverypasswords collection
                await this.deleteOneFromPasswordRecovery(this.userId)

                return this.returnType(202 , true, `Your password reset was successful. Sign in to continue`);

            } else {
                return this.returnType(200 , false, `An error occured reseting your password`);
            }


        } else {
            return this.returnType(200 , false, `An error occured. Incomplete details. Click the link in your mailbox to try again`);
        }

    }
}