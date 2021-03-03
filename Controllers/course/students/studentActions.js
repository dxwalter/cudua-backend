
const StudentController = require('./studentController');
const StudentModel = require('../../../Models/studentModel');
const CourseActions = require('../courseManager/course')

const bcrypt = require('bcrypt');

module.exports = class StudentActions extends StudentController {

    constructor () {
        super()
        this.CourseActions = new CourseActions()
    }

    returnMethod (code, success, message) {

        return {
            code, success, message
        }
    }

    returnMethodForDp (url, code, success, message) {
        return {
            url, code, success, message
        }
    }

    async recoverStudentPassword(email) {

        if (email.length < 5 || this.validateEmailAddress(email) == false) {
            return this.returnMethod(500, false, "Enter a valid email address")
        }

        // check if email exists
        let checkEmail = await this.emailExists(email);
        if (checkEmail.error) return this.returnMethod(500, false, "An error occurred")
        if (checkEmail.result == null) return this.returnMethod(500, false, "A mail has been sent to the email on file")

        // send email
        let actionUrl = `https://kokeko.xyz/auth/change-password?e=${email}`;
        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Change your password</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        

            <p style="font-size: 14px; line-height: 27px; margin-bottom: 16px;">You can change the password to your account by clicking the link below.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">Change your account's password.</p>
        
        </div>
        `
        let subject = `Change your password`;
        let textPart = "Never share this link";
        let logoUrl = "https://res.cloudinary.com/cudua-images/image/upload/v1613919731/cudua_asset/koeko-logo_szwsuk.png"

        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage, logoUrl);
        
        this.sendMail('security@koeko.xyz', subject, email, messageBody, textPart, "Koeko");

        return this.returnMethod(200, true, "An message has been sent to your email address")
        
    }

    async createNewPassword (email, password) {
        
        if (email.length < 5 || this.validateEmailAddress(email) == false) {
            return this.returnMethod(500, false, "Enter a valid email address")
        }

        if (password.length < 6) return this.returnMethod(500, false, "Enter a valid password for your account")

        // check if email exists
        let checkEmail = await this.emailExists(email);
        if (checkEmail.error) return this.returnMethod(500, false, "An error occurred")
        
        
        let userId = checkEmail.result._id;

        let newPassord = await bcrypt.hashSync(password, 10)

        let updateProfileData = {password: newPassord}

        let accountUpdata = await this.findOneStudentAndUpdate(userId, updateProfileData);

        if (accountUpdata.error) {
            return this.returnMethod(500, false, "An error occurred when changing your password");
        }

        return this.returnMethod(200, true, "Your password was changed successfully")

    }

    async EditStudentLogo (file, userId) {

        const { filename, mimetype, createReadStream } = await file;

        if (filename.length < 1) return this.returnMethodForDp(null, 200, false, "Choose a profile display picture");

        // encrypt file name
        let encryptedName = this.encryptFileName(filename)

        let newFileName = encryptedName + "." + mimetype.split('/')[1];

        const stream = createReadStream();

        let path = 'uploads/courseCategoryImage/';

        const pathObj = await this.uploadImageFile(stream, newFileName, path);
        
        if (pathObj.error == true) {
            return this.returnMethodForDp(null, 500, false, "An error occurred uploading your profile picture")
        }

        let folder = process.env.CLOUDINARY_FOLDER+"/cudua-course/";
        let publicId = encryptedName;
        let tag = 'profile picture';
        let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

        let deleteFile = await this.deleteFileFromFolder(imagePath)

        if (moveToCloud.error == true) {
            return this.returnMethodForDp(null, 500, false, `An error occurred uploading your profile picture`)
        }


        // update new file name
        
        newFileName = moveToCloud.result.secure_url;

        let profilePicture = {'profilePicture': newFileName}

        let updateLogo = await this.findOneStudentAndUpdate(userId, profilePicture)
        
        if (updateLogo.error == false) {
            return this.returnMethodForDp(newFileName, 202, true, "Your profile picture was updated successfully", newFileName)
        } else {
            return this.returnMethodForDp(null, 500, false, "An error occurred updating your profile pictre")
        }


    }

    async EditProfileDetails (fullName, email, phone, instagram, gender, userId) {
        
        if (fullName.length < 3) {
            return this.returnMethod(500, false, "Your fullname must be greater than 2 characters");
        }

        fullName = this.formatFullname(fullName);

        if (email.length < 5 || this.validateEmailAddress(email) == false) {
            return this.returnMethod(500, false, "Enter a valid email address.")
        }

        // check if email exists
        let checkEmail = await this.emailExists(email);
        if (checkEmail.error) return this.returnMethod(500, false, "An error occurred. Kindly contact us")
        if (checkEmail.result != null && checkEmail.result._id != userId) return this.returnMethod(500, false, "This email address already exists. Kindly contact us")

        if (phone.length < 4) return this.returnMethod(200, false, "Enter a valid phone number")

        if (instagram.length < 4) {
            return this.returnMethod(500, false, "Your instagram handle is not valid")
        }

        if (gender.length == 0) {
            return this.returnMethod(500, false, "Choose your gender")
        }


        let newData = {
            fullname: fullName,
            email: email,
            phone: phone,
            gender: gender,
            instagramId: instagram
        }

        let updateProfile = await this.findOneStudentAndUpdate(userId, newData);

        if (updateProfile.error) {
            return this.returnMethod(500, false, updateProfile.message)
        }

        return this.returnMethod(200, true, "Your profile was updated successfully")

    }
}