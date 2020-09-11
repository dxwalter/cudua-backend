"use-strict";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = require('../UserController');
const UserModel = require('../../../Models/UserModel');
const BusinessController = require('../../business/BusinessController');
const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController');
const LocationController = require('../../Location/LocationController');
const MoveToOnymousCart = require('../../anonymousCart/action/anonymousAddItemToCart');

const SubscriptionController = require('../../subscription/subscriptionController')

module.exports = class LoginUser extends UserController{

    constructor (args) {
        super();
        this.email = args.email.toLowerCase();
        this.password = args.password.toLowerCase();
        this.anonymousId = args.anonymousId;
        this.model = UserModel;
        this.BusinessController = new BusinessController();
        this.LocationController = new LocationController();
        this.BusinessCategoryInstance = new BusinessCategoryController();
        this.MoveToOnymousCart = new MoveToOnymousCart();
        this.SubscriptionController = new SubscriptionController();
    }

    returnType (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    formatBusinessCategoryData(dataArray) {


        let businessCategoryArray = [];
        let categoryCount = 0; // 

        // retrieve category data
        for (const [categoryIndex, category] of dataArray.entries()) {
            let arr = category;
            let categoryDetails = category.category_id
            let subcategoriesList = category.subcategories;


            let newData = {
                itemId: arr._id,
                categoryId: categoryDetails._id,
                hide: arr.hide,
                categoryName: categoryDetails.name,
                subcategories: []
            }

            //retrieve subcategory data from subcategory array
            for (const [subcategoryIndex, subcategories] of subcategoriesList.entries()) {
                let subcategoryDetails = subcategories.subcategory_id
                newData.subcategories.push({
                    itemId: subcategories._id,
                    hide: subcategories.hide,
                    subcategoryId: subcategoryDetails._id,
                    subcategoryName: subcategoryDetails.name
                })
            }

            // format subcategories in alphabetical order using their names
            let subcategorytoFormat = this.SortSubcategories(newData.subcategories);

            newData.subcategories = subcategorytoFormat;

            businessCategoryArray[categoryCount] = newData;
            
            categoryCount = categoryCount + 1;

        }

        return this.SortCategories(businessCategoryArray);

    }

    
    returnAddress(addressObject) {
        return {
            number: addressObject.number,
            street: addressObject.street.name,
            community:  addressObject.community.name,
            lga:  addressObject.lga.name,
            state:  addressObject.state.name,
            country: addressObject.country.name,
            busStop: addressObject.bus_stop
        }

    }

    async formatAddress (addressObject) {

        let streetId = addressObject.street
        if (streetId == undefined) return null

        let findStreet = await this.LocationController.SearchStreetById(streetId);

        if (findStreet.error) return null

        findStreet = findStreet.result;

        return {
            number: addressObject.number,
            street: findStreet.name,
            community: findStreet.community_id.name,
            lga: findStreet.lga_id.name,
            state: findStreet.state_id.name,
            country: findStreet.country_id.name,
            busStop: addressObject.bus_stop
        }

    }

    async getBusinessDetails (businessDetails) {
        
        // business data
        let getBusinessData = businessDetails;

        // business address
        let businessAddress = getBusinessData.address == null || getBusinessData.address == undefined ? null : await this.formatAddress(getBusinessData.address)

        let businessId = getBusinessData._id;
        let businessReview = getBusinessData.review_score;

        let businessCategories = await this.BusinessCategoryInstance.getbusinessCategories(businessId);
    
        if (businessCategories.error == true) {
            return this.returnType(500 , false, 'An error occurred while retrieving your business category')
        }

        if (businessCategories.error == false && businessCategories.result == false ) {
            businessCategories = null;
        } else {
            // this is the array of business categories and subcategories chosen by this business owner
            businessCategories = this.formatBusinessCategoryData(businessCategories.result);
        }

        // business contact
        let businessContact =  {
            email: getBusinessData.contact.email == undefined || getBusinessData.contact.email.length < 1 ? null : getBusinessData.contact.email,
            phone: getBusinessData.contact.phone == undefined || getBusinessData.contact.phone.length < 1 ? null: getBusinessData.contact.phone,
            whatsapp: {
                status: getBusinessData.contact.whatsapp.status,
                number: getBusinessData.contact.whatsapp.number
            }
        }

        // get subscription
        let subscription = await this.SubscriptionController.getSubscriptionById(businessDetails.subscription)
        if (subscription.error) {
            subscription = null
        } else {
            let subscriptionData = subscription.result

            if (subscriptionData == null ){
                subscription = null
            } else {
                subscription = {
                    subscriptionDate: subscriptionData.subscription_date,
                    expiryDate: subscriptionData.expiry_date,
                    subscriptionId: subscriptionData._id,
                    subscriptionType: this.MakeFirstLetterUpperCase(subscriptionData.type)
                }
            }
        }
        
        // Business data including address and contact put together
        return {
            id: getBusinessData._id,
            businessname: getBusinessData.businessname,
            username: getBusinessData.username,
            description: getBusinessData.description.length < 1 ||  getBusinessData.description == undefined ? null : getBusinessData.description,
            address: businessAddress,
            contact: businessContact,
            review: businessReview,
            logo: getBusinessData.logo.length < 1 || getBusinessData.logo == undefined ? null : getBusinessData.logo,
            coverPhoto: getBusinessData.coverPhoto.length < 1 || getBusinessData.coverPhoto == undefined ? null :  getBusinessData.coverPhoto,
            businessCategories: businessCategories,
            subscription: subscription
        }


    }

    async AuthenticateUser () {

        if (this.email.length && this.password.length) {

                let findEmail = await this.findOneEmail(this.email);

                if (findEmail.error == true) {
                    return this.returnType(200 , false, findEmail.message)
                }
    
                findEmail = findEmail.result;

                if (findEmail != null) {
                    
                    let userDbDetails = findEmail;
                    let userId = userDbDetails._id
                    let dbPassword = userDbDetails.password;

                    let comparePassword = await this.comparePassword(dbPassword, this.password)
                    if (comparePassword.error == true) {
                        return this.returnType(500 , false, "An error occurred. Please try again")
                    }

                    comparePassword = comparePassword.result

                    if (comparePassword == true) {
                        let accessToken = jwt.sign({ id: userId }, process.env.SHARED_SECRET, { expiresIn: '720h' });

                        let businessDetails = userDbDetails.business_details;

                        let businessData = "";
                        let businessId = "";

                        if (businessDetails == undefined || businessDetails == null) {
                            businessData = null
                            businessId = null
                        } else {
                            businessData = await this.getBusinessDetails(businessDetails);
                            businessId = businessDetails._id
                        }

                        // check if anonymous Id exists
                        if(this.anonymousId != null && this.anonymousId.length > 0) {
                            this.MoveToOnymousCart.MoveAnonymousCartToOnymousCart(this.anonymousId, userId)
                        }

                        return {
                            // user object
                            userDetails: {
                                userId : userDbDetails._id,
                                fullname: userDbDetails.fullname,
                                email: userDbDetails.email,
                                email_notification: userDbDetails.email_notification == null || undefined ? 1 : userDbDetails.email_notification,
                                phone: userDbDetails.phone == null || undefined ? null : userDbDetails.phone,
                                displayPicture: userDbDetails.profilePicture == null || undefined ? null : userDbDetails.profilePicture,
                                review: userDbDetails.review_score == null || undefined ? null : userDbDetails.review_score,
                                address: userDbDetails.address.street == null || undefined ? null : this.returnAddress(userDbDetails.address),
                                businessId: businessId,
                            },
                            // business details
                            businessDetails: businessData,
                            accessToken: accessToken,
                            code: 200,
                            success: true,
                            message: "Hurray! Your sign in was successfully"
                        };
                    } else {
                       return this.returnType(200 , false, `Incorrect sign in details`)
                    }
                    
                } else {
                    return this.returnType(200 , false, `Incorrect sign in details`)
                }

        } else {
            
            return this.returnType(200 , false, `Your email address and password is required to let you in`)
        }
    }

}