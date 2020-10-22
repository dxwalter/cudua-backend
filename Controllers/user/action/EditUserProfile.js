"use-strict"

const UserController = require('../UserController');
const BusinessController = require('../../business/BusinessController');
const LocationController = require('../../Location/LocationController');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    returnMethodForDp (code, success, message, imagePath = "") {
        return {
            code: code,
            success: success,
            message: message,
            imagePath: imagePath
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
            if (checkUserExist.result != null) return this.returnMethod(200, false, "The email address you entered is already exists.");

            // check if email is used by business
            let checkEmailInBusiness = await this.BusinessController.checkIfEmailExists(email);
            if (checkEmailInBusiness.error) return this.returnMethod(500, false, "An error occurred from our end. Please try again")
            if (checkEmailInBusiness.result != null) {
                // check if the business is owned by this customer
                if (checkEmailInBusiness.result.owner != userId) return this.returnMethod(200, false, "The email address you entered already exists.");
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
            return this.returnMethod(200, false, "No profile update was made. Enter new details to update your profile")
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

    async editUserDp (file, userId) {
        const { filename, mimetype, createReadStream } = await file;

        if (filename.length < 1) return this.returnMethodForDp(200, false, "Choose a profile display picture");

        let userData = await this.findUsersById(userId);
        if (userData.error) return this.returnMethodForDp(500, false, "An error occurred. Please try again")
        userData = userData.result

        // encrypt file name
        let encryptedName = this.encryptFileName(filename)

        let newFileName = encryptedName + "." + mimetype.split('/')[1];

        const stream = createReadStream();

        let path = 'uploads/profilePicture/';

        const pathObj = await this.uploadImageFile(stream, newFileName, path);
        
        if (pathObj.error == true) {
            return this.returnMethodForDp(500, false, "An error occurred uploading your business logo")
        }

        // This is used to remove data from cloudinary
        if (userData.profilePicture != null || userData.profilePicture != undefined) {
            let publicID = `cudua_commerce/customer/${userId}/profilePicture/${userData.profilePicture.split('.')[0]}`;
            // remove from cloudinary
            let removeFromCloudinary = await this.removeFromCloudinary(publicID, 'image') 
        }

        //upload to cloudinary

        let folder = "cudua_commerce/customer/"+userId+"/profilePicture/";
        let publicId = encryptedName;
        let tag = 'profile picture';
        let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

        let deleteFile = await this.deleteFileFromFolder(imagePath)

        if (moveToCloud.error == true) {
            return this.returnMethodForDp(500, false, `An error occurred uploading your profile picture`)
        }


        // update new file name
        
        let profilePicture = {'profilePicture': newFileName}
        let updateLogo = await this.findOneAndUpdate(userId, profilePicture)
        
        if (updateLogo.error == false) {
            return this.returnMethodForDp(202, true, "Your profile picture was updated successfully", newFileName)
        } else {
            return this.returnMethodForDp(500, false, "An error occurred updating your profile pictre")
        }


    }

    async editCustomerFullname(fullname, userId) {

        if (fullname.length < 3) return this.returnMethod(200, false, "Your fullname must be greater than 2 characters");

        let userData = await this.findUsersById(userId);

        if (userData.error) return this.returnMethod(500, false, "An error occurred. Please try again")
        userData = userData.result

        fullname = this.formatFullname(fullname);

        if (fullname != userData.fullname) {

            let updateRecord = await this.findOneAndUpdate(userId, {fullname: fullname});

            if (updateRecord.error) return this.returnMethod(500, false, "An error occurred updating your profile.")
    
            return this.returnMethod(202, true, "Your profile was updated successfully");
        }
        
        return this.returnMethod(200, false, "No profile update was made. Enter new details to profile")

    }

    async editCustomerPassword (oldPassword, newPassword, userId) {
        
        if (newPassword.length < 6) return this.returnMethod(200, false, "Your new password must be greater than 5 characters");

        let userData = await this.findUsersById(userId);
        if (userData.error) return this.returnMethod(500, false, "An error occurred. Please try again")
        userData = userData.result

        let comparePassword = await this.comparePassword(userData.password, oldPassword);
        if (comparePassword.error == true) {
            return this.returnMethod(500 , false, "An error occurred. Please try again")
        }

        if (comparePassword.result == false) return this.returnMethod(200, false, "Your current password is incorrect");

        newPassword = await bcrypt.hashSync(newPassword, 10);

        let updateRecord = await this.findOneAndUpdate(userId, {password: newPassword});

        if (updateRecord.error) return this.returnMethod(500, false, "An error occurred updating your profile.")

        return this.returnMethod(202, true, "Your profile was updated successfully");
    

    }

}