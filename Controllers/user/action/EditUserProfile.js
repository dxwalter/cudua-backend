"use-strict"

const UserController = require('../UserController');
const BusinessController = require('../../business/BusinessController');
const LocationController = require('../../Location/LocationController');

module.exports = class EditUserProfile extends UserController {
    constructor() {
        super();
        this.BusinessController = new BusinessController();
        this.LocationController = new LocationController();
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }


    async editUserContact(email, phone, userId) {
        
        let userData = await this.findUsersById(userId);
        let updateData = {};
        let updateStatus = 0;

        

        if (userData.error) return this.returnMethod(500, false, "An error occurred. Please try again")
        
        userData = userData.result

        // email validation
        if (email != userData.email) {
            // check if email was provided
            if (email.length < 4) return this.returnMethod(200, false, "Enter a valid email address");
            // check if email is used as customer
            let checkUserExist = await this.findUserByEmail(email);
            if (checkUserExist.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again")
            if (checkUserExist.result != null) return this.returnMethod(200, false, "The email address you entered is used by another customer.");

            // check if email is used by business
            let checkEmailInBusiness = await this.BusinessController.checkIfEmailExists(email);
            if (checkEmailInBusiness.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again")
            if (checkEmailInBusiness.result != null) {
                // check if the business is owned by this customer
                if (checkEmailInBusiness.result.owner != userId) return this.returnMethod(200, false, "The email address you entered is used by a business.");
            }

            updateData["email"] = email.trim();
            updateStatus = 1
        }

        // phone validation
        if (phone != userData.phone) {
            if (phone.length < 4) return this.returnMethod(200, false, "Enter a valid phone number");
            let checkIfPhoneNumberExists = await this.findUsersByField({phone: phone});
            if (checkIfPhoneNumberExists.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again");
            if (checkIfPhoneNumberExists.result != null) return this.returnMethod(200, false, "The phone number you chose already exists")

            updateData["phone"] = phone.trim();
            updateStatus = 1
        }


        if (updateStatus == 0) {
            return this.returnMethod(200, true, "No profile update was made. Enter new details to profile")
        }

        let updateRecord = await this.findOneAndUpdate(userId, updateData);

        if (updateRecord.error) return this.returnMethod(500, false, "An error occurred updating your profile.")

        return this.returnMethod(202, true, "Your profile was updated successfully");

    }

    async editCustomerAddress(streetNumber, streetId, busStop, userId) {

        let userData = await this.findUsersById(userId);
        let updateStatus = 0;
        let updateData = {};

        if (userData.error) return this.returnMethod(500, false, "An error occurred. Please try again")
        userData = userData.result


        // update for the first time
        if (streetNumber < 1) return this.returnMethod(200, false, "Enter a valid house number");

        if (streetNumber != userData.address.number) {
            updateData["address"] = {number: streetNumber};
            updateStatus = 1;
        } else {
            updateData["address"] = {number: userData.address.number};
        }


        if (busStop.length < 1)  return this.returnMethod(200, false, "The bus stop closest to your house was not provided");
        
        if (busStop != userData.address.bus_stop) {
            updateData["address"]["bus_stop"] = busStop;
            updateStatus = 1;
        } else {
            updateData["address"]["bus_stop"] = userData.address.bus_stop;
        }

        if (streetId.length < 1) return this.returnMethod(200, false, "Provide your street address");

        if (streetId != userData.address.street) {
            // find street
            let findStreet = await this.LocationController.SearchStreetById(streetId);
            if (findStreet.error) return this.returnMethod(500, false, "An error occurred locating your street. Please try again")
            if (findStreet.result == null) return this.returnMethod(200, false, "Your street was not found. Please add your street")
            
            findStreet = findStreet.result;
            updateData["address"]["street"] = findStreet._id;
            updateData["address"]["community"] = findStreet.community_id._id;
            updateData["address"]["lga"] = findStreet.lga_id._id;
            updateData["address"]["state"] = findStreet.state_id._id;
            updateData["address"]["country"] = findStreet.country_id._id
            updateStatus = 1;

        } else {
            updateData["address"]["street"] = userData.address.street;
            updateData["address"]["community"] = userData.address.community;
            updateData["address"]["lga"] = userData.address.lga;
            updateData["address"]["state"] = userData.address.state;
            updateData["address"]["country"] = userData.address.country;
        }

        
        if (updateStatus == 0) {
            return this.returnMethod(200, true, "No profile update was made. Enter new details to profile")
        }

        let updateRecord = await this.findOneAndUpdate(userId, updateData);

        if (updateRecord.error) return this.returnMethod(500, false, "An error occurred updating your profile.")

        return this.returnMethod(202, true, "Your profile was updated successfully");


    }

}