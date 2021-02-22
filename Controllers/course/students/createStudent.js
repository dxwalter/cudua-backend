
const StudentController = require('./studentController');
const StudentModel = require('../../../Models/studentModel');
const CourseActions = require('../courseManager/course')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class createNewStudent extends StudentController {

    constructor () {
        super()
        this.CourseActions = new CourseActions()
    }

    returnMethod (studentData, success, message, code) {

        return {
            studentData, code, success, message
        }
    }

    async CreateStudent (fullname, email, password, courseId, transactionRefId) {
        
        if (fullname.length < 3) {
            return this.returnMethod(null, false, "Your fullname must be greater than 2 characters", 500);
        }

        this.fullname = this.formatFullname(fullname);

        let newPassord = ''

        if (password.length < 6) {
            return this.returnMethod(null, false, "Your password must be greater than 5 characters",  500);
        } else {
            newPassord = await bcrypt.hashSync(password, 10)
        }

        if (email.length < 5 || this.validateEmailAddress(email) == false) {
            return this.returnMethod(null, false, "Enter a valid email address",  500);
        }

        // check if email exists
        let checkEmail = await this.emailExists(email);
        if (checkEmail.error) return this.returnMethod(null, false, "An error occurred. Kindly contact us", 500)
        if (checkEmail.result != null) return this.returnMethod(null, false, "This email address already exists. Kindly contact us", 500)

        const createStudent = new StudentModel ({
            fullname : fullname,
            email : email,
            password: newPassord
        });

        let data = await this.createStudentAccount(createStudent);
        if (data.error == true) {
            return this.returnMethod(null, false, "An error occurred while creating your account", 500);
        }

        data = data.result;

        let userId = data._id;
        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '720h' });

        this.CourseActions.enrollInCourse(userId, courseId, transactionRefId)

        // send email
        let actionUrl = `https://kokeko.xyz/profile/edit`;
        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Update Your Profile</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px">Congratulations <span style="color: #ee6425">${data.fullname}!</span> Your account on Koeko is up and running.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom: 16px;">Koeko is designed to bring great courses at great prices that will help you learn how to run certain aspects of your business with so as to save cost and maximise profit.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">Update your profile to see this courses.</p>
        
        </div>
        `
        let subject = `Congratulations! Your account is up and running`;
        let textPart = "You can find great courses with great prices with ease.";
        let logoUrl = "https://res.cloudinary.com/cudua-images/image/upload/v1613919731/cudua_asset/koeko-logo_szwsuk.png"

        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage, logoUrl);
        
        this.sendMail('nor-reply@koeko.xyz', subject, data.email, messageBody, textPart, "Koeko");

        let newData =  {
            id : data._id,
            name: data.fullname,
            email: data.email,
            accessToken: accessToken,
        };
        return this.returnMethod(newData, true, "Your account was created successfully",  200);

    }
}