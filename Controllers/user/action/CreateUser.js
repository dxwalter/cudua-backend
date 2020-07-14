"use-strict";

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let UserController = require('../UserController')
let UserModel = require('../../../Models/UserModel')    

module.exports = class CreateUser extends UserController{

    constructor (args) {
        super();
        this.fullname = args.fullname;
        this.email = args.email.toLowerCase();
        this.password = args.password.toLowerCase();
        this.model = UserModel;

    }

    formatFullname (name) {
        // if name contains space, break name into two variables
        name = name.toLowerCase();
        let whitespacePosition = name.search(" ");
        if (whitespacePosition == -1) {
            // no whitespace exists
            this.fullname = this.MakeFirstLetterUpperCase(name)
            return;
        }

        let splitName = name.split(" ");
        let formattedName = "";
        splitName.forEach(element => {
            let newName = this.MakeFirstLetterUpperCase(element);
            formattedName = formattedName + " " + newName
        });
        this.fullname = formattedName.toString().trim();
    }

    returnMethod (fullname, email, status, statusMessage, statusCode) {
        return {
            fullname: fullname,
            email: email,
            userId: '',
            code: statusCode,
            success: status,
            message: statusMessage,
            accessToken: ""
        };
    }

    async validateUserInput() {
        
        if (this.fullname.length < 3) {
            return this.returnMethod('', '', false, "Your fullname must be greater than 2 characters", 200);
        }

        this.formatFullname(this.fullname);

        if (this.password.length < 6) {
            return this.returnMethod('', '', false, "Your password must be greater than 6 characters",  200);
        } else {
            this.password = bcrypt.hashSync(this.password, 10)
        }

        if (this.email.length < 5) {
            return this.returnMethod('', '', false, "Enter a valid email address",  200);
        }
        
        let checkEmailExistence = await this.emailExists(this.email);

        if (checkEmailExistence.error == true) {
            return this.returnMethod('', '', false, checkEmailExistence.message,  200);
        } else if (checkEmailExistence.result == true) {
            return this.returnMethod('', '', false, `The email address: ${this.email}, already exists`,  200);   
        }

        const createUser = new UserModel ({
            fullname : this.fullname,
            email : this.email,
            password: this.password
        });

        let data = await this.createUserAccount(createUser);
        if (data.error == true) {
            return this.returnMethod('', '', false, data.message,  200);
        }
        
        data = data.result;

        let userId = data._id;
        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '24h' });
        
        return {
            userId : data._id,
            fullname: data.fullname,
            email: data.email,
            phone: null,
            displaPicture: null,
            businessId: null,
            accessToken: accessToken,
            code: 200,
            success: true,
            message: "Your account was created successfully"
        };
    }
}
