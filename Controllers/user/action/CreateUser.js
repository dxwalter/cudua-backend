"use-strict";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = require('../UserController')
const UserModel = require('../../../Models/UserModel')    
const MoveToOnymousCart = require('../../anonymousCart/action/anonymousAddItemToCart');
const CreateNotification = require('../../notifications/action/createNotification')

module.exports = class CreateUser extends UserController{

    constructor (args) {
        super();
        this.fullname = args.fullname;
        this.email = args.email.toLowerCase();
        this.password = args.password.toLowerCase();
        this.anonymousId = args.anonymousId
        this.model = UserModel;

        this.MoveToOnymousCart = new MoveToOnymousCart();

        this.CreateNotification = new CreateNotification()

    }

    returnMethod (data, status, statusMessage, statusCode) {

        return {
            userData: data,
            code: statusCode,
            success: status,
            message: statusMessage,
        }
    }

    async validateUserInput() {
        
        if (this.fullname.length < 3) {
            return this.returnMethod(null, false, "Your fullname must be greater than 2 characters", 200);
        }

        this.fullname = this.formatFullname(this.fullname);

        if (this.password.length < 6) {
            return this.returnMethod(null, false, "Your password must be greater than 5 characters",  200);
        } else {
            this.password = await bcrypt.hashSync(this.password, 10)
        }

        if (this.email.length < 5) {
            return this.returnMethod(null, false, "Enter a valid email address",  200);
        }
        
        let checkEmailExistence = await this.emailExists(this.email);

        if (checkEmailExistence.error == true) {
            return this.returnMethod(null, false, "An error occurred. Kindly try again",  500);
        } else if (checkEmailExistence.result != null) {
            return this.returnMethod(null, false, `The email address: ${this.email}, already exists`,  200);   
        }

        const createUser = new UserModel ({
            fullname : this.fullname,
            email : this.email,
            password: this.password
        });

        createUser['reviews'] = createUser._id;

        let data = await this.createUserAccount(createUser);
        if (data.error == true) {
            return this.returnMethod(null, false, "An error occurred while creating your account",  200);
        }
        data = data.result;

        if(this.anonymousId != null && this.anonymousId.length > 0) {
            this.MoveToOnymousCart.MoveAnonymousCartToOnymousCart(this.anonymousId, data._id)
        }

        let userId = data._id;
        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '720h' });

        await this.CreateNotification.createCustomerNotification(userId, userId, "customer_profile", "Account created", "Congratulations! Your account is up and running.")
        await this.CreateNotification.createCustomerNotification(userId, userId, "customer_profile", "Update profile", "Update your profile to see products and businesses around you")

        // send email
        let actionUrl = `https://cudua.com/c/profile/edit`;
        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Update Your Profile</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px">Congratulations <span style="color: #ee6425">${data.fullname}!</span> Your account on Cudua is up and running.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom: 16px;">Cudua is designed to bring great products at great prices that is not far away from where you live so you can easily access access them.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">Update your profile to see this products.</p>
        
        </div>
        `
        let subject = `Congratulations! Your account is up and running`;
        let textPart = "You can find great products with great prices with ease.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, data.email, messageBody, textPart, "Cudua");


        let newData =  {
            userId : data._id,
            fullname: data.fullname,
            email: data.email,
            review: data.review_score,
            phone: null,
            displaPicture: null,
            businessId: null,
            accessToken: accessToken,
        };
        return this.returnMethod(newData, true, "Your account was created successfully",  200);
    }
}
