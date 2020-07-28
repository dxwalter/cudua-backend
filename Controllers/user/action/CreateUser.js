"use-strict";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = require('../UserController')
const UserModel = require('../../../Models/UserModel')    
const MoveToOnymousCart = require('../../anonymousCart/action/anonymousAddItemToCart')

module.exports = class CreateUser extends UserController{

    constructor (args) {
        super();
        this.fullname = args.fullname;
        this.email = args.email.toLowerCase();
        this.password = args.password.toLowerCase();
        this.anonymousId = args.anonymousId
        this.model = UserModel;

        this.MoveToOnymousCart = new MoveToOnymousCart()

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
            return this.returnMethod(null, false, checkEmailExistence.message,  200);
        } else if (checkEmailExistence.result == true) {
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
        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '24h' });
        let newData =  {
            userId : data._id,
            fullname: data.fullname,
            email: data.email,
            phone: null,
            displaPicture: null,
            businessId: null,
            accessToken: accessToken,
        };
        return this.returnMethod(newData, true, "Your account was created successfully",  200);
    }
}
