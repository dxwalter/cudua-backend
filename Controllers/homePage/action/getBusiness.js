'use-strict'

const ProductController = require('../../product/ProductController');
const BusinessController = require('../../business/BusinessController');
const BusinessCategoryController = require('../../businessCategory/BusinessCategoryController')

module.exports = class HomePageGetBusiness extends BusinessController {
    constructor () {
        super();
        this.ProductController = new ProductController();
        this.BusinessCategoryController = new BusinessCategoryController();
        this.page = 1
        this.certifiedBusiness = []
        this.scoreZero = []
        this.scoreOne = []
        this.scoreTwo = []
    }

    returnMethod (business, code, success, message) {
        return {
            business: business,
            code: code,
            success: success,
            message: message
        }
    }

    formatBusinessCategoryString (categoryData) {
        let categoryString = "";

        for (let [index, category] of categoryData.entries()) {
            
            if(index == 0) {
                categoryString = `${category.category_id.name}`
            }

            if (index > 0) {
                categoryString = categoryString + `, ${category.category_id.name}`
            }

            if (index == 3 ) {
                categoryString = `${categoryString}, etc.`;
                break;
            }

        }

        return categoryString
    }

    async getBusinessForHomePage () {
        
        // get businesses
        let getBusiness = await this.homePageBusiness(this.page);

        if (getBusiness.error) return this.returnMethod(null, 500, false, "An error occurred. Please try again")

        let data = getBusiness.result

        if (data.length == 0 && this.page == 1) return this.returnMethod(this.certifiedBusiness, 200, true, "No business to be shown");

        let businessWithProducts = []

        // check if business has products
        for (let businessData of data) {
            let businessId = businessData.id
            
            let productCount = await this.ProductController.countBusinessProducts({business_id: businessId})
            if (productCount > 0) {
                businessWithProducts.push(businessData)
            }
        }
        
        let businessScore = 0;

        for (let businessData of businessWithProducts) {

            if (businessData.contact.phone.length > 0) {
                businessScore = businessScore + 1;
            }

            if (businessData.address.number != undefined) {
                businessScore = businessScore + 1
            }

            // get category data
            let businessCategory = await this.BusinessCategoryController.getbusinessCategories(businessData.id);
            
            let formatBusinessCategory = ""
            if (businessCategory.error == false) {
                formatBusinessCategory = this.formatBusinessCategoryString(businessCategory.result);   
            }

            let dataObject = {
                businessId: businessData.id,
                logo: businessData.logo,
                businessName: businessData.businessname,
                username: businessData.username,
                reviewScore: businessData.review_score,
                categoryString: formatBusinessCategory
            }

            if (businessScore == 0) {
                this.scoreZero.push(dataObject)
            }

            if (businessScore == 1) {
                this.scoreOne.push(dataObject)
            }

            if (businessScore == 2) {
                this.scoreTwo.push(dataObject)
            }

            businessScore = 0
        }

        let totalCount = this.scoreZero.length + this.scoreOne.length + this.scoreTwo.length;

        if (totalCount < 20 && data.length > 0) {
            this.page = this.page + 1;
            this.getBusinessForHomePage();
        }

        this.certifiedBusiness = [...this.scoreTwo, ...this.scoreOne, ...this.scoreZero];

        return this.returnMethod(this.certifiedBusiness, 200, true, "Business retrieved");
    }
}