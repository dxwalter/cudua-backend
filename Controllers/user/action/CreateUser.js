"use-strict";

const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require("crypto");
const mongoose = require('mongoose');

let UserController = require('../UserController')
let UserModel = require('../../../Models/UserModel')

module.exports = class CreateUser extends UserController{

    constructor (args) {
        
        super();
        this.fullname = args.fullname;
        this.email = args.email;
        this.password = args.password.toLowerCase();
        this.model = UserModel;

    }

    returnMethod (fullname, email, status, statusMessage) {
        return {
            fullname: fullname,
            email: email,
            requestStatus: status,
            requestMessage: statusMessage
        };
    }

    async validateUserInput() {
        
        if (this.fullname.length < 3) {
            return this.returnMethod('', '', 0, "Your fullname must be greater than 2 characters");
        }

        if (this.password.length < 6) {
            return this.returnMethod('', '', 0, "Your password must be greater than 6 characters");
        } else {
            this.password = bcrypt.hashSync(this.password, 10)
        }

        if (this.email.length < 5) {
            return this.returnMethod('', '', 0, "Enter a valid email address");
        } else if (await this.emailExists(this.email) == false) {
            return this.returnMethod('', '', 0, `The email address: ${this.email}, already exists`);
        }

        const createUser = new UserModel ({
            fullname : this.fullname,
            email : this.email,
            password: this.password
        });

        let data = await this.createUserAccount(createUser);
        let userId = data._id;
        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '24h' });

        return {
            userId : data._id,
            fullname: data.fullname,
            email: data.fullname,
            phone: "",
            displaPicture: "",
            businessId: "",
            accessToken: accessToken,
            requestStatus: 1,
            requestMessage: "Your account was created successfully"
        };
    }
}
