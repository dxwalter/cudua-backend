"use-strict";


let BusinessController = require('../BusinessController')
let UserController = require('../../user/UserController')

module.exports = class EditBusinessDetails extends BusinessController {

    constructor () {
        super();
        this.UserController = new UserController();
        this.businessLogoPath = 'uploads/logo';
        this.businessCoverPhotoPath = 'uploads/coverPhoto';
    }

    
    
    returnData (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    async basicDetails (args, userId) {

        let businessId = args.businessId;
        let username = args.businessUsername.toLowerCase().trim();
        let businessName = args.businessName.trim();
        let businessDescription = args.businessDescription.trim();

        let businessData = await this.getBusinessData(businessId);

        let newDatacheck = 0

        
        if (businessData.error == true) {
            return this.returnData(500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        // validate

        if (username.length == 0 && businessName.length == 0 && businessDescription.length == 0) {
            return this.returnData(200, false, 'Enter a new business name, username or business description');
        }

        

        
        // check if data are the same
        //business name
        if (businessName != businessData.result.businessname) {
            //update
            if (businessName.length <= 3) {
                return this.returnData(200, false, "Your business name must be greater than three characters");
            }
            let newBusinessNameObject = {businessname: businessName}
            let updatebusinessName = await this.findOneAndUpdate(businessId, newBusinessNameObject);

            if (updatebusinessName.error == true) {
                return this.returnData(500, false, "An error occurred updating your business name. Please try again");
            }
            newDatacheck = 1
        }

        // business username
        if (username != businessData.result.username) {
            //update
            if (username.length <= 3) {
                return this.returnData(200, false, "Your business username must be greater than three characters");
            }
    
            // regex username
            
            let checkUsername = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/ig).test(username)
    
            if (checkUsername == false) {
                return this.returnData(200, false, "Enter a valid username. Username must not contain any space or special character");
            }
    
            let usernameCheck = await this.checkUsernameExists(username);
            
            if (usernameCheck.error == true) {
                return this.returnData(200, false, usernameCheck.message);
            }
    
            if (usernameCheck.result == true) {
                return this.returnData(200, false, `The username ${username} exists. Try a different username`);
            }

            let newUsernameObject = {username: username}
            let updatebusinessUsername = await this.findOneAndUpdate(businessId, newUsernameObject);

            if (updatebusinessUsername.error == true) {
                return this.returnData(500, false, "An error occurred updating your business username. Please try again");
            }
            newDatacheck = 1
        }

        // business description
        if (businessDescription != businessData.result.description) {
            //update

            if (businessDescription.length < 10) {
                return this.returnData(200, false, "Describe your business to your customers");
            }

            let newBusinessDescriptionObject = {description: businessDescription}
            let updatebusinessDescription = await this.findOneAndUpdate(businessId, newBusinessDescriptionObject);

            if (updatebusinessDescription.error == true) {
                return this.returnData(500, false, "An error occurred updating your business description. Please try again");
            }
            newDatacheck = 1
        }


        // check if any update was made at all
        if (newDatacheck == 0) {
            return this.returnData(200, true, "Your profile was not updated because not change in data was detected")
        } else {
            return this.returnData(202, true, "Your business profile was updated successfully")
        }
    }

    async editBusinessPhoneNumber (phoneNumbers, businessId, userId) {

        let businessData = await this.getBusinessData(businessId);
        if (businessData.error == true) {
            return this.returnData(500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let newphoneNumbers = phoneNumbers.split(',')

        if (newphoneNumbers.length < 1) {
            return this.returnData(200, false, `Add at least one or multiple phone numbers seperated by comma`)
        }

        let updateBusinessPhone = await this.saveBusinessPhoneNumber(businessId, newphoneNumbers);

        if (updateBusinessPhone.error == true) {
            return this.returnData(500, false, "An error occurred updating your business phone number(s). Please try again");
        }


        if (newphoneNumbers.length > 1) {
            return this.returnData(202, true, 'Your business phone numbers has been updated successfully')
        } else {
            return this.returnData(202, true, 'Your business phone number has been updated successfully')
        }

        

    }

    async editBusinessEmailAddress(emailAddress, businessId, notification, userId) {
        
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let updateNotification = await this.UserController.findOneAndUpdate(userId, {email_notification: notification});
        
        if (emailAddress == businessData.result.contact.email) {
            return this.returnData(200, false, "No update was made. Enter a new email address for your business")
        }


        if (emailAddress.length < 4) {
            return this.returnData(200, false, "Enter a valid email address")
        }

        let checkIfEmailExists = await this.checkIfEmailExists(emailAddress);

        if (checkIfEmailExists.error == true) {
            return this.returnData(500, false, "An error occurred. Please try again")
        }

        if (checkIfEmailExists.result == false) {
            // check if email exists as user email
            let emailInUser = await this.UserController.findUserByEmail(emailAddress);

            if (emailInUser.error == true) {
                return this.returnData(500, false, "An error occurred. Please try again")
            } 
          
            if (emailInUser.result.length > 0) {
                
                if (emailInUser.result[0]._id != userId) {
                    return this.returnData(200, false, "The email address you chose already exists")
                }

            }

        } else {
            return this.returnData(200, false, "The email address you chose already exists")
        }

        // update email
        let newEmailUpdate = {'contact.email': emailAddress}
        let updateEmail = await this.findOneAndUpdate(businessId, newEmailUpdate)
        
        if (updateEmail.error == false) {
            return this.returnData(202, true, "Your email was updated successfully")
        } else {
            return this.returnData(500, false, "An error occurred updating your email")
        }
        
    }

    async editBusinessWhatsappContact(phoneNumber, businessId, notification, userId) {

        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        if (phoneNumber.length < 5) {
            return this.returnData(200, false, `Enter a valid phone number`)
        }

        let updateNotification = await this.findOneAndUpdate(businessId, {'contact.whatsapp.status': notification});

        // check if whatsapp number exists for a business
        
        if (phoneNumber == businessData.result.contact.whatsapp.number) {
            return this.returnData(200, false, "No update was made. Enter a new Whatsapp phone number for your business")
        }

        // check if phone number exists in user 
        let userNumberCheck = await this.UserController.findUserByEmail(phoneNumber);

        if (userNumberCheck.result.length > 0) {
            if (userNumberCheck.result[0]._id != userId) {
                return this.returnData(200, false, "The phone number you chose already exists. Choose a different phone number")
            }
        }

        // update email
        let newWhatsappUpdate = {'contact.whatsapp.number': phoneNumber}
        let updateWhatsapp = await this.findOneAndUpdate(businessId, newWhatsappUpdate)
        
        if (updateWhatsapp.error == false) {
            return this.returnData(202, true, "Your Whatsapp number was updated successfully")
        } else {
            return this.returnData(500, false, "An error occurred updating your email")
        }

    }

    async changeBusinessLogo(businessId, file, userId) {
        
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        const { filename, mimetype, createReadStream } = await file;

        if (filename.length < 1) {
            return this.returnData(200, false, "Choose a logo for your business")
        }

        // encrypt file name
        let newFileName = this.encryptFileName(filename) + "." + mimetype.split('/')[1];

        const stream = createReadStream();

        let path = this.businessLogoPath;

        const pathObj = await this.uploadImageFile(stream, newFileName, path);

        if (pathObj.error == true) {
            return this.returnData(500, false, "An error occurred uploading your business logo")
        }

        // move to cloudinary

        //upload to cloudinary

        let folder = "cudua_commerce/business/"+businessId+"/logo/";
        let publicId = newFileName;
        let tag = 'logo';
        let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

        let deleteFile = await this.deleteFileFromFolder(imagePath)

        if (moveToCloud.error == true) {
            return this.returnData(500, false, `An error occurred uploading your business logo`)
        }


        // update new file name
        
        let newLogo = {'logo': newFileName}
        let updateLogo = await this.findOneAndUpdate(businessId, newLogo)
        
        if (updateLogo.error == false) {
            return this.returnData(202, true, "Your business logo was updated successfully")
        } else {
            return this.returnData(500, false, "An error occurred updating your business logo")
        }
    }

    async changeBusinessCoverPhoto(businessId, file, userId) {
        
        let businessData = await this.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnData(500, false, "An error occurred. Please try again")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnData(200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        const { filename, mimetype, createReadStream } = await file;

        if (filename.length < 1) {
            return this.returnData(200, false, "Choose a cover photo for your business")
        }

        // encrypt file name
        let newFileName = this.encryptFileName(filename) + "." + mimetype.split('/')[1];

        const stream = createReadStream();

        let path = this.businessCoverPhotoPath;

        const pathObj = await this.uploadImageFile(stream, newFileName, path);

        if (pathObj.error == true) {
            return this.returnData(500, false, "An error occurred uploading your business cover photo")
        }

        // move to cloudinary

        //upload to cloudinary

        let folder = "cudua_commerce/business/"+businessId+"/cover/";
        let publicId = newFileName;
        let tag = 'cover';
        let imagePath = pathObj.path;

        let moveToCloud = await this.moveToCloudinary(folder, imagePath, publicId, tag);

        let deleteFile = await this.deleteFileFromFolder(imagePath)

        if (moveToCloud.error == true) {
            return this.returnData(500, false, `An error occurred uploading your business logo`)
        }


        // update new file name
        
        let newCover = {'coverPhoto': newFileName}
        let updateCover = await this.findOneAndUpdate(businessId, newCover)
        
        if (updateCover.error == false) {
            return this.returnData(202, true, "Your business cover photo was updated successfully")
        } else {
            return this.returnData(500, false, "An error occurred updating your business cover photo")
        }
    }

}