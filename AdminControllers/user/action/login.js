'use-strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminController = require('../adminController');
const AdminModel = require('../../../Models/cudua-admins/AdminModel');

module.exports = class loginAdmin extends adminController {

    constructor () {
        super()
    }

    returnData (userData, code, success, message) {
        return {
            userData: userData,
            code: code,
            success: success,
            message: message
        }
    }

    async LoginUser(email, password) {

        if (email.length && password.length) {

            let findEmail = await this.emailExists(email);

            if (findEmail.error == true) {
                return this.returnData(null, 200 , false, findEmail.message)
            }

            findEmail = findEmail.result;


            if (findEmail != null) {
                    
                let userDbDetails = findEmail;

                let userId = userDbDetails._id
                let dbPassword = userDbDetails.password;

                let comparePassword = await this.comparePassword(dbPassword, password)
                if (comparePassword.error == true) {
                    return this.returnData(null, 500 , false, "An error occurred. Please try again")
                }

                comparePassword = comparePassword.result

                if (comparePassword == true) {
                    let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '720h' });

                    return this.returnData ({
                            fullname: userDbDetails.fullname,
                            email: userDbDetails.email,
                            displayPicture: userDbDetails.profilePicture == null || undefined ? null : userDbDetails.profilePicture,
                            accessToken: accessToken
                        },
                        // business details
                        200,
                        true,
                        "Hurray! Your sign in was successfully"
                    );
                } else {
                   return this.returnData(null, 200 , false, `Incorrect sign in details`)
                }
            } else {
                return this.returnData(null, 200 , false, `Incorrect sign in details`)
            }



        } else {
            
            return this.returnData(null, 200 , false, `Your email address and password is required to let you in`)
        }

    }

}