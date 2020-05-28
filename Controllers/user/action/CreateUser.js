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

module.exports = class CreateUser extends UserController{

    constructor (Model, args) {
        
        this.fullname = args.fullname;
        this.email = args.email;
        this.password = args.password;
        this.model = Model;

        constructor

    }

    returnMethod (fullname, email, status, statusMessage) {
        return {
            fullname: fullname,
            email: email,
            requestStatus: status,
            requestMessage: statusMessage
        };
    }

    validateUserInput() {
        if (this.fullname.length < 3) {
            return this.returnMethod('', '', 'false', "Your fullname must be greater than 2 characters");
        }

        if (this.password.length < 6) {
            return this.returnMethod('', '', 'false', "Your password must be greater than 6 characters");
        } else {
            this.password = bcrypt.hashSync(this.password.toLowerCase(), 10)
        }

        if (this.email.length < 5) {
            return this.returnMethod('', '', 'false', "Enter a valid email address");
        } else if (super.emailExists() == false) {
            return this.returnMethod('', '', 'false', `Your email: ${this.email} already exists`);
        }




    }
}
