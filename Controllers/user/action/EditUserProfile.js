"use-strict"

const UserController = require('../UserController');
const BusinessController = require('../../business/BusinessController')

module.exports = class EditUserProfile extends UserController {
    constructor() {
        super();
        this.BusinessController = new BusinessController();
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async editUserContact(email, phone, streetNumber, streetId, busStop, userId) {
        
        let userData = await this.findUsersById(userId);

        if (userData.error) return this.returnMethod(500, false, "An error occurred. Please try again")
        
        userData = userData.result

        if (email != userData.email) {
            // check if email was provided
            if (email.length < 4) return this.returnMethod(200, false, "Enter a valid email address");
            // check if email exist
            let checkUserExist = await this.findUserByEmail(email);
            if (checkUserExist.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again")
            if (checkUserExist.result != null) return this.returnMethod(200, false, "The email address you entered is used by another customer.");
        }

    }

}