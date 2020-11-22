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

                let subject = "Password Reset";
                let textPart = "Change your password to a more secured password.";

                let actionUrl = `https://cudua.com/auth/create-new-password?sub=${userId}&init=${secret}`;
                let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Reset your password</a>`;

                let emailMessage =`
                <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">

                    <div style="margin-bottom: 16px; text-align:center;">Your request to reset your password was successful. Click "Reset your password" link below to change to a new passwprd</div>
                
                </div>
                `;

                let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

                let sendEmail = await this.sendMail('no-reply@cudua.com', subject, this.email, messageBody, textPart)


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