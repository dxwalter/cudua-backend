"use-strict";

const BusinessController = require('../BusinessController');
const BusinessModel = require('../../../Models/BusinessModel');
const UserController = require('../../user/UserController');

const CreateSubscription = require('../../subscription/action/createSubscription');

const CreateNotification = require('../../notifications/action/createNotification')

module.exports = class CreateBusiness extends BusinessController {

    constructor(args) {
        super();
        this.name = args.name.toLowerCase();
        this.username = args.username.toLowerCase();
        this.inviteId = args.inviteId
        this.UserController = new UserController();
        this.CreateNotification = new CreateNotification()

        this.createSubscription = new CreateSubscription();
    }

    returnRequestStatus (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    sendEmailForFailedSubscription (emailAddress) {
        let actionUrl = `https://cudua.com/info/contact`;
        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Contact Us Now</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">Oops! Failed subscription.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom: 16px;">An error occurred while creating your free one month subscription. We are very sorry for the inconveniences this will cause.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">If you contact us, we can fix this and restore your subscription</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">Best Wishes.</p>
        
        </div>
        `

        let subject = `Oops! Subscription failed`;
        let textPart = "and your shop and products will not appear on Cudua.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");
    }

    sendEmailForPassedSubscription (emailAddress, name, username) {

        let actionUrl = `https://cudua.com/b/profile/edit?billing=true`;
        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">View Your Subscription</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 28px; line-height:27px;">Congratulations <span style="color: #ee6425">${name}!</span> Your free one month subscription has been activated.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom: 16px;">When you have an active subscription, your shop <span style="color: #ee6425"><a href="https://cudua.com/${username}">https://cudua.com/${username}</a></span> and products will appear in search results and product suggestions.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">To see your subscription, you need to go to your <a href="https://cudua.com/b">SHOP MANAGER</a>.</p>
        
        </div>
        `

        let subject = `Congratulations! Your subscription was activated`;
        let textPart = "Your shop and products will appear on Cudua.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");
    }

    sendEmailToJoinCuduaAcademy (emailAddress, name, username) {

        let actionUrl = `https://cudua.com/b/academy`;
        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Grow your business online</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">Join our learning community.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom: 16px;">We understand that selling online is not a ride in the park. This is why we have setup an online learning community where we will teach all you need to know sell online and it is free.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">To join this community, click the link below.</p>
        
        </div>
        `
        
        let subject = `Learn how to grow your online business`;
        let textPart = "online.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");
    }

    sendEmailForCreatingSuccessfulBusiness(emailAddress, name, username) {

        let actionUrl = `https://cudua.com/b/profile/edit?billing=true`;
        let emailAction = `<a class="mcnButton" href="${actionUrl}" target="_blank" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Upload a Product Now</a>`;

        let emailMessage =`
        <div style="margin: 10px 0 16px 0px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #757575;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left; ">
        
            <p style="font-size: 28px; font-weight:bold; margin-bottom: 32px; line-height:27px;">Congratulations <span style="color: #ee6425">${name}!</span> Your online shop is up and running.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom: 16px;">Your online store can be accessed when anybody visits <span style="color: #ee6425"><a href="https://cudua.com/${username}"></a>https://cudua.com/${username}</span>. But you need to upload your first product.</p>

            <p style="font-size: 14px; line-height: 27px; margin-bottom:32px;">To upload your first product, you have to go to your <span style="color: #ee6425"><a href="https://cudua.com/b">SHOP MANAGER</a></span>, and <span style="color: #ee6425"><a href="https://cudua.com/b/product/add-product">ADD A PRODUCT</a></span>.</p>
        
        </div>
        `
        
        let subject = `Congratulations! Your online store was created successfully`;
        let textPart = "Your shop and products will appear on Cudua.";


        let messageBody = this.emailMessageUi(subject, emailAction, emailMessage);

        this.sendMail('Cudua@cudua.com', subject, emailAddress, messageBody, textPart, "Cudua");
    }

    async saveViralRegistration(inviteId, businessId) {

        // get viral id details
        let viralIdDetails = await this.GetViralIdDetails(inviteId);

        if (viralIdDetails.error) return

        if (viralIdDetails.result == null) return

        let details = viralIdDetails.result;

        // count the number of documents that matches this inviteId

        

        let uplinerId = details.business_id;

        // save and notify the business that initiated the invite
        let createDownLiner = await this.createNewDownliner(uplinerId, businessId);

        if (createDownLiner.error) return

        let count = await this.countBusinessInvite(details.business_id);
        if (count.error) return

        if (count.result == 3) {
            await this.CreateNotification.createBusinessNotification(uplinerId, inviteId, "Invite", "New Invite", `A new shop was created using your invitation link. You are qualified to get one month free basic plan.`);
            return
        }

        let text = ""

        if (count.result == 2) {
            text = "Invite have one more business to qualify for one month free basic plan"
        }

        if (count.result == 1) {
            text = "Invite two more businesses to qualify for one month free basic plan"
        }

        await this.CreateNotification.createBusinessNotification(uplinerId, inviteId, "Invite", "New Invite", `A new shop was created using your invitation link. ${text}`);
    }


    // order scripts are tied to this function. you should have written test but you chose not to
    async validateBusinessInput (userId) {
        

        let name = this.MakeFirstLetterUpperCase(this.name);
        let username = this.username;

        if (name.length <= 3) {
            return this.returnRequestStatus(200, false, "Your business name must be greater than 3 characters");
        }

        if (username.length <= 3) {
            return this.returnRequestStatus(200, false, "Your business username must be greater than 3 characters");
        }

        // regex username
        if (this.checkReservedWords(username)) {
            return this.returnRequestStatus(200, false, `${username} is a reserved word. Enter a different username`);
        }
        
        let checkUsername = new RegExp(/^(?!.*\.\.\s)(?!.*\.$)[^\W][\w.]{0,29}$/ig).test(username)

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
        });

        createBusiness.reviews = createBusiness.id

        let data = await this.createBusinessAccount(createBusiness);

        if (data.error == true) {
            return this.returnRequestStatus(500, false, data.message);
        }

        data = data.result

        let UserController = await this.UserController.findOneAndUpdate(userId, {business_details: data._id});

        if (UserController.error == true) {
            return this.returnRequestStatus(200, false, `An error occurred updating your personal account as a business owner. More details: ${UserController.message}`);
        }

        let emailAddress = UserController.result.email;

        // create notification
        await this.CreateNotification.createBusinessNotification(data._id, data._id, "business_profile", "Online store created", "Congratulations! Your online store is up and running.");
        await this.CreateNotification.createBusinessNotification(data._id, data._id, "business_profile", "Update business profile", "Update your business profile to help customers find you.");
        
        // create one month basic subscription for free

        let createSub = await this.createSubscription.createNewSubscription(data._id, "free tier", "basic", 1);
        
        let subData = null;

        if (createSub.error) {
            await this.CreateNotification.createBusinessNotification(data._id, data._id, "Subscription", "Failed subscription", "An error occurred while activating your one month free basic subscription plan. Please our contact support team to get this issue fixed.");
        } else {
            // update
            let subscriptionData = createSub.result;

            let updateData = await this.findOneAndUpdate(data._id, {
                subscription: subscriptionData._id
            });

            let actionUrl;
            let emailAction;
            let emailMessage;

            if (updateData.error) {
                await this.CreateNotification.createBusinessNotification(data._id, subscriptionData._id, "Subscription", "Failed subscription", "An error occurred while activating your one month free basic subscription plan. Please our contact support team to get this issue fixed.");

                // send email

                this.sendEmailForFailedSubscription(emailAddress)


            } else {
                await this.CreateNotification.createBusinessNotification(data._id, subscriptionData._id, "Subscription", "Successful subscription", "Your one month free basic subscription has been activated. Visit plans & billings tab in your account setting to learn more.");

                // send email

                this.sendEmailForPassedSubscription(emailAddress, name, username)
            }

            subData = {
                subscriptionId: subscriptionData._id,
                subscriptionDate: subscriptionData.subscription_date,
                expiryDate: subscriptionData.expiry_date,
                subscriptionType: this.MakeFirstLetterUpperCase(subscriptionData.type),
            }

        }

        if (this.inviteId != undefined && this.inviteId.length > 0) {
            this.saveViralRegistration(this.inviteId, data._id)
        }
    
        // send email
        
        this.sendEmailForCreatingSuccessfulBusiness(emailAddress, name, username)
        this.sendEmailToJoinCuduaAcademy(emailAddress, name, username)

        return {
            businessDetails : {
                businessname: data.businessname,
                username: data.username,
                id: data._id,
                subscription: subData
            },
            code: 200,
            success: true,
            message: "Hurray! your business has been created successfully"
        }
    }

}