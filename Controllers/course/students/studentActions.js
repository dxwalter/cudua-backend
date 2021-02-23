
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
}