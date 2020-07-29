"use-strict";

let BusinessController = require('../BusinessController');
let BusinessModel = require('../../../Models/BusinessModel');

let UserController = require('../../user/UserController');

const CreateNotification = require('../../notifications/action/createNotification')

module.exports = class CreateBusiness extends BusinessController {

    constructor(args) {
        super();
        this.name = args.name.toLowerCase();
        this.username = args.username.toLowerCase();
        this.model = BusinessModel;
        this.UserController = new UserController();
        this.CreateNotification = new CreateNotification()
    }

    returnRequestStatus (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async validateBusinessInput (userId) {
        
        let name = this.MakeFirstLetterUpperCase(this.name);
        let username = this.username;

        if (name.length <= 3) {
            return this.returnRequestStatus(200, false, "Your business name must be greater than three characters");
        }

        if (username.length <= 3) {
            return this.returnRequestStatus(200, false, "Your business username must be greater than three characters");
        }

        // regex username
        
        let checkUsername = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/ig).test(username)

        if (checkUsername == false) {
            return this.returnRequestStatus(200, false, "Enter a valid username. Username must not contain any space or special character");
        }

        let usernameCheck = await this.checkUsernameExists(username);
        
        if (usernameCheck.error == true) {
            return this.returnRequestStatus(200, false, 'An error occurred checking if username exists');
        }

        if (usernameCheck.result > 0) {
            return this.returnRequestStatus(200, false, `The username ${username} exists. Try a different username`);
        }
      
        const createBusiness = new BusinessModel ({
            businessname : name,
            username : username,
            owner: userId,
            reviews: userId
        });

        let data = await this.createBusinessAccount(createBusiness, userId);

        if (data.error == true) {
            return this.returnMethod('', '', false, data.message,  200);
        }

        data = data.result

        let UserController = await this.UserController.findOneAndUpdate(userId, {business_details: data._id});

        if (UserController.error == true) {
            return this.returnRequestStatus(200, false, `An error occurred updating your personal account as a business owner. More details: ${UserController.message}`);
        }
        await this.CreateNotification.createBusinessNotification(data._id, data._id, "business_profile", "Online store created", "Congratulations! Your online store is up and running.");
        await this.CreateNotification.createBusinessNotification(data._id, data._id, "business_profile", "Update business profile", "Update your business profile to help customers find you.");

        return {
            businessDetails : {
                businessname: data.businessname,
                username: data.username,
                id: data._id
            },
            code: 200,
            success: true,
            message: "Hurray! your business has been created successfully"
        }
    }

}