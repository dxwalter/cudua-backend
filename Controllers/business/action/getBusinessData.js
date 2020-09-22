"use-strict";


const BusinessController = require('../BusinessController');
const BusinessReview = require('./businessReview');
const BusinessCategory = require('../../businessCategory/action/getBusinessCatgory');


module.exports = class GetBusinessData extends BusinessController {

    constructor () {
        super();
        this.businessReview = new BusinessReview();
        this.businessCategory = new BusinessCategory()
    }

    returnData (businessData, code, success, message) {

        return {
            businessData: businessData,
            code: code,
            success: success,
            message: message
        }

    }

    returnAddress(addressObject) {
        if (addressObject.street == undefined) return null
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

    formatBusinessOwnerData(data, returnData) {
        if (data == null) return ''
        if (returnData == 'email') {
            if (data.email == undefined) return ''
            return data.email
        }

        if (returnData == 'phone') {
            if (data.phone == undefined) return []
            return data.phone
        }
    }

    async formatBusinessDetails (businessDetails, businessOwner) {

        
        // business data
        let getBusinessData = businessDetails;

        

        // business address
        let businessAddress = getBusinessData.address == null || getBusinessData.address == undefined ? null : this.returnAddress(getBusinessData.address);

        let businessId = getBusinessData._id;
        let businessReview = getBusinessData.review_score;

        let businessCategories = await this.businessCategory.getbusinessCategories(businessId);
    
        if (businessCategories.error == true) {
            businessCategories = [];
        }

        if (businessCategories.error == false && businessCategories.result == null ) {
            businessCategories = [];
        } else {
            // this is the array of business categories and subcategories chosen by this business owner
            businessCategories = this.formatBusinessCategoryData(businessCategories.result);
        }

        // business contact
        let businessContact =  {
            email: getBusinessData.contact.email == undefined || getBusinessData.contact.email.length < 1 ? this.formatBusinessOwnerData(businessOwner, 'email') : getBusinessData.contact.email,
            phone: getBusinessData.contact.phone == undefined || getBusinessData.contact.phone.length < 1 ? [] : getBusinessData.contact.phone,
            whatsapp: {
                status: getBusinessData.contact.whatsapp.status,
                number: getBusinessData.contact.whatsapp.number
            }
        }
        
        // Business data including address and contact put together
        return {
            id: getBusinessData._id,
            businessname: getBusinessData.businessname,
            username: getBusinessData.username,
            description: getBusinessData.description.length < 1 ||  getBusinessData.description == undefined ? "" : getBusinessData.description,
            address: businessAddress,
            contact: businessContact,
            review: businessReview,
            logo: getBusinessData.logo.length < 1 || getBusinessData.logo == undefined ? "" : getBusinessData.logo,
            coverPhoto: getBusinessData.coverPhoto.length < 1 || getBusinessData.coverPhoto == undefined ? "" :  getBusinessData.coverPhoto,
            businessCategories: businessCategories
        }


    }

    async getData (username) {
        
        if (username.length < 1) return this.returnData(null, 200, false, "Provide a business username")

        // get business data
        let businessData = await this.getBusinessDataByUsername(username);
        
        if (businessData.error) return this.returnData(null, 200, false, "An error occurred. Kindly try again")


        if (businessData.result == null) return this.returnData(null, 200, true, `No result was found for "${username}"`)

        let businessOwner = businessData.result.owner == null ? null : businessData.result.owner

        let businessDetails = await this.formatBusinessDetails(businessData.result, businessOwner);
        
        let businessId = businessDetails.id;

        let businessReview = await this.businessReview.GetBusinessReview(businessId);

        if (businessReview.success == false || businessReview.reviews.length == 0) {
            businessReview = null
        } else {
            businessReview = businessReview.reviews
        }

        businessDetails.reviews = businessReview

        return this.returnData(businessDetails, 200, true, "Business details retrieved")

        
        
    }

}