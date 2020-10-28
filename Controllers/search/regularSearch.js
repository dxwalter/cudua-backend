
const ProductController = require('../product/ProductController')
const BusinessController = require('../business/BusinessController')

module.exports = class RegularSearch {
    constructor () {
        this.ProductController = new ProductController();
        this.BusinessController = new BusinessController();
    }

    returnMethod (products, businesses, code, success, message) {
        return {
            products: products,
            businesses: businesses,
            code: code,
            success: success,
            message: message
        }
    }

    formatBusinessData (businessData) {
        
        return {
            businessname: businessData.businessname,
            address: businessData.address.number == undefined ? null : {
                number: businessData.address.number,
                street: businessData.address.street.name,
                community: businessData.address.community.name,
                lga: businessData.address.lga.name,
                state: businessData.address.state.name,
                country: businessData.address.country.name
            },
            logo: businessData.logo,
            id: businessData.id,
            username: businessData.username
        }
    }

    scoreBusinessResult(businessResult) {

        let scoreZero = [];
        let scoreOne = [];
        let scoreTwo = [];
        let scoreThree = [];

        let businessScore = 0;

        for (const [index, x] of businessResult.entries()) {

            if (x.address.number != undefined) {
                businessScore = businessScore + 1
            }

            if (x.contact.phone.length > 0) {
                businessScore = businessScore + 1
            }

            if(x.description.length > 0) {
                businessScore = businessScore + 1
            }

            let newData = this.formatBusinessData(x)

            if (businessScore == 0) {
                if (x.subscription_status == 0) {
                    scoreZero.push(newData)
                }
            }

            if (businessScore == 1) {
                if (x.subscription_status == 0) {
                    scoreOne.push(newData)
                }
            }

            if (businessScore == 2) {
                if (x.subscription_status == 0) {
                    scoreTwo.push(newData)
                }
            }

            if (businessScore == 3) {
                if (x.subscription_status == 0) {
                    scoreThree.push(newData)
                }
            }

            businessScore = 0
        }

        return [...scoreThree, ...scoreTwo, ...scoreOne, ...scoreZero];

    }

    formatProductData(productData) {
        return {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            reviewScore: productData.score,
            primaryImage: productData.primary_image,
            businessId: productData.business_id.id
        }
    }

    scoreProductResult(productResult) {

        let scoreZero = [];
        let scoreOne = [];
        let scoreTwo = [];
        let scoreThree = [];
        let scoreFour = []

        let productScore = 0;

        for (let x of productResult) {

            if (x.description.length > 0) {
                productScore = productScore + 1
            }

            if (x.images.length > 0) {
                productScore = productScore + 1
            }
            
            if (x.sizes.length > 0) {
                productScore = productScore + 1
            }

            if (x.colors.length > 0) {
                productScore = productScore + 1
            }

            if (x.business_id.subscription_status == 0) {

                let newData = this.formatProductData(x)

                if (productScore == 0) {
                        scoreZero.push(newData)
                }

                if (productScore == 1) {
                    scoreOne.push(newData)
                }

                if (productScore == 2) {
                    scoreTwo.push(newData)
                }

                if (productScore == 3) {
                    scoreThree.push(newData)
                }

                if (productScore == 4) {
                    scoreFour.push(newData)
                }
            }

            productScore = 0
        }

        return [...scoreFour, ...scoreThree, ...scoreTwo, ...scoreOne, ...scoreZero];

    }

    async InitiateSearch (keyword, page = 1) {
        
        if (keyword.length < 1) return this.returnMethod(null, null, 500, false, "You did not provide a search string")

        // search for product

        let productSearch = await this.ProductController.RegularProductSearch(keyword, page);

        let productResult = [];

        if (productSearch.error == true) {
            productResult = [];
        }

        productResult = productSearch.result;

        // search for business

        let businessSearch = await this.BusinessController.RegularBusinessSearch(keyword, page);
        let businessResult = [];

        if (businessSearch.error) { 
            businessResult = [];
        }

        businessResult = businessSearch.result;

        // format business data
        let scoreBusinessData;

        if (businessResult.length > 0) {
            scoreBusinessData = this.scoreBusinessResult(businessResult);
        } else {
            scoreBusinessData = []
        }


        // format product data
        let scoreProductData;
        if (productResult.length > 0) {
            scoreProductData = this.scoreProductResult(productResult);
        } else {
            scoreProductData = []
        }

        return this.returnMethod(scoreProductData, scoreBusinessData, 200, true, "Search successfull")

    }

}