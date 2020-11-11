'use-strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminController = require('../adminController');
const AdminModel = require('../../../Models/cudua-admins/AdminModel');

module.exports = class CreateAdmin extends adminController {
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

    async validateAdminData(fullname, email, password) {
        
        if (fullname.length < 3) return this.returnData(null, 500, false, "Enter your fullname. It must be greater than 3 characters.")
        if (email.length < 5) return this.returnData(null, 500, false, "Enter a valid email address");

        fullname = this.formatFullname(fullname);

        if (password.length < 6) {
            return this.returnData(null, 500, false, "Your password must be greater than 5 characters");
        } else {
            password = await bcrypt.hashSync(password, 10)
        }

        let checkEmailExistence = await this.emailExists(email);

        if (checkEmailExistence.error == true) {
            return this.returnData(null, 500, false, "An error occurred. Kindly try again");
        } else if (checkEmailExistence.result != null) {
            return this.returnData(null, 500, false, `The email address: ${email}, already exists`);  
        }

        const createAdmin = new AdminModel ({
            fullname : fullname,
            email : email,
            password: password
        });

        let create = await this.createAdminAccount(createAdmin);

        if (create.error == true) {
            return this.returnData(null, 500, false, "An error occurred while creating your account. Kindly try again");
        }

        let userId = create.result._id;
        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '720h' });

        return this.returnData({
            fullname: fullname,
            email: email,
            password: password,
            accessToken: accessToken
        },
        200, true, "Your account was created successfully"
        )


    }

}