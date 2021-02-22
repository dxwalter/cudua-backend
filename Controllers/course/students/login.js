
const StudentController = require('./studentController');
const StudentModel = require('../../../Models/studentModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class createNewStudent extends StudentController {

    constructor () {
        super()
    }

    returnMethod (studentData, success, message, code) {

        return {
            studentData, code, success, message
        }
    }

    async loginStudent (email, password) {

        if (email.length == 0 || password.length < 6) return this.returnMethod(null, false, "Enter a valid email address and a valid password", 500)

        let findEmail = await this.emailExists(email);

        if (findEmail.error == true) {
            return this.returnMethod(null, false, "An error occurred validating your email address. Kindly try again", 500)
        }

        findEmail = findEmail.result;

        if (findEmail == null) return this.returnMethod(null, false, "Enter a valid email address and password", 200);

        let userDbDetails = findEmail;

        let userId = userDbDetails._id
        let dbPassword = userDbDetails.password;

        let comparePassword = await this.comparePassword(dbPassword, password)

        if (comparePassword.error == true) {
            return this.returnMethod(null, false, "An error occurred. Kindly try again", 500)
        }

        comparePassword = comparePassword.result

        if (comparePassword == false) return this.returnMethod(null, false, "Enter a valid email address and password", 200);

        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '720h' });

        let userData = {
            id: userDbDetails._id,
            name: userDbDetails.fullname,
            email: userDbDetails.email,
            gender: userDbDetails.gender == undefined ? "" : userDbDetails.gender,
            instagramId: userDbDetails.instagramId == undefined ? "" : userDbDetails.instagramId,
            phoneNumber: userDbDetails.phone,
            profilePhoto: userDbDetails.profilePicture,
            accessToken: accessToken
        }

        return this.returnMethod(userData, true, "You login request was successful", 200)

    }

}