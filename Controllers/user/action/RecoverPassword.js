"use-strict";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

        if (this.email.length == 0) return this.returnType(500 , false, "Enter a valid email address")

        // check if email exists in db
        let checkEmailExist = await this.emailExists(this.email);
        if (checkEmailExist.error == true || checkEmailExist.result == null) {
            return this.returnType(200 , false, "An error occurred. Kindly try again")
        }

        checkEmailExist = checkEmailExist.result
        
        if (checkEmailExist._id) {
            
            let userDetails = await this.findUserByEmail(this.email);
            if (userDetails.error == true) {
                return this.returnType(200 , false, "An error occurred")
            } else {
                userDetails = userDetails.result;
            }
            
            let userId = userDetails._id;

            let checkEmailExistInRecovery = await this.emailExistsInForgotPassword(this.email);
           
            if (checkEmailExistInRecovery.error == true) {
                return this.returnType(200 , false, "An error occurred. Please try again")
            } else if (checkEmailExistInRecovery.result) {
                this.deleteOneFromPasswordRecovery(userId);
            }

            // generate secret key
            let secret = this.HashFileName(await this.generateId());

            // insert
            const insertForgotPassword = new RecoverPasswordModel ({
                userId: userId,
                secret: secret
            });

            let createForgotPassword = await this.createForgotPassword(insertForgotPassword);

            if (createForgotPassword.error == true) {
                return this.returnType(200 , false, "An error occurred")
            } else {
                createForgotPassword = createForgotPassword.result;
            }

            if(createForgotPassword._id) {

                // let emailObject = {
                //     to: this.email,
                //     from: 'test@example.com',
                //     subject: 'Sending with Twilio SendGrid is Fun',
                //     text: 'and easy to do anywhere, even with Node.js',
                //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                // }

                // send mail
                // console.log(this.sendEmail(emailObject));

                // action string
                let url = `https://cudua.com/auth/create-new-password?sub=${userId}&init=${secret}`

                console.log(url)


                return this.returnType(200 , true, `A recovery email was sent to your account`)
            } else {
                return this.returnType(200 , false, `An error occured`)
            }

        } else {
            return this.returnType(200 , false, `A recovery email was sent to the email above`);
        }
    

        // Check if customer data exists in forgot password db
        // send email
    }

    async createNewPassword(args) {
        this.password = args.password
        this.secret = args.secret;
        this.userId = args.userId;

        let checkSecret = await this.checkRecoverySecret(this.secret, this.userId);
        if (checkSecret.error == true) {
            return this.returnType(200 , false, "An error occurred. Kindly try again")
        }
        
        if (this.secret && checkSecret.result != null) {

            if (this.password.length < 6) {
                return this.returnType(200 , false, "Your password must be greater than 5 characters");
            } else {
                this.password = await bcrypt.hashSync(this.password, 10)
            }
                
            // update 
            let newData = {
                password: this.password
            };

            let changePassword = await this.findOneAndUpdate(this.userId, newData);
            
            if (changePassword.error == true) {
                return this.returnType(200 , false, "An error occurred. Kindly try again");
            }

            // delete from  recoverypasswords collection
            await this.deleteOneFromPasswordRecovery(this.userId)

            return this.returnType(202 , true, `Your password was successful changed. Sign in to continue`);


        } else {
            return this.returnType(200 , false, `An error occured. Incomplete details. Click the link in your mailbox to try again`);
        }

    }
}