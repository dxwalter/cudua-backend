
const ProductController = require('../product/ProductController')
const BusinessController = require('../business/BusinessController')
const LocationController = require('../Location/LocationController')
const BusinessCategoryController = require('../businessCategory/BusinessCategoryController')

module.exports = class AdvancedSearch extends ProductController {
    constructor () {
        super()
        this.ProductController = new ProductController();
        this.BusinessController = new BusinessController();
        this.LocationController = new LocationController();
        this.BusinessCategoryController = new BusinessCategoryController()
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

    
    async formatBusinessData (businessData) {
        
        let searchAddress;

        if (businessData.address.number != undefined) {
            searchAddress = await this.LocationController.SearchStreetById(businessData.address.street);
            if (searchAddress.error) {
                businessData.address.number = undefined
            }
        }
        searchAddress = searchAddress.result

        let businessCategory = await this.BusinessCategoryController.getbusinessCategories(businessData.id);
            
        let formatBusinessCategory = ""
        if (businessCategory.error == false) {
            formatBusinessCategory = this.formatBusinessCategoryString(businessCategory.result);   
        }

        return {
            businessName: businessData.businessname,
            address: businessData.address.number == undefined ? null : {
                number: businessData.address.number,
                street: searchAddress.name,
                community: searchAddress.community_id.name,
                lga: searchAddress.lga_id.name,
                state: searchAddress.state_id.name,
                country: searchAddress.country_id.name
            },
            logo: businessData.logo,
            businessId: businessData.id,
            username: businessData.username,
            categoryString: formatBusinessCategory,
            reviewScore: businessData.review_score
        }
    }

    async scoreBusinessResult(businessResult) {

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

            let newData = await this.formatBusinessData(x);

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

    async BusinessSearch (communityId, page) {

        let businessSearch = await this.BusinessController.advancedBusinessSearch(communityId, page);

        if (businessSearch.error) return {error: false, message: "An error occurred from our end. Kindly try again"};
        
        let businessResult = [];

        if (businessResult.error == true) {
            businessResult = [];
        }

        businessResult = businessSearch.result;

        let businessWithProducts = []

        // check if business has products
        for (let businessData of businessResult) {
            let businessId = businessData.id
            
            let productCount = await this.ProductController.countBusinessProducts({business_id: businessId});
            if (productCount > 0) {
                businessWithProducts.push(businessData)
            }
        }

        // format business data
        let scoreBusinessData;

        if (businessResult.length > 0) {
            scoreBusinessData = await this.scoreBusinessResult(businessWithProducts);
        } else {
            scoreBusinessData = []
        }

        return {result: scoreBusinessData, error: false}
    }

    async formatProductData(productData) {
        let businessData = await this.formatBusinessData(productData.business_id);
        let addressString = `${businessData.address.street}, ${businessData.address.community}`;
        return {
            productId: productData.id,
            name: productData.name,
            price: productData.price,
            reviewScore: productData.score,
            image: productData.primary_image,
            businessId: productData.business_id.id,
            addressString: addressString
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

    async CheckCommunity(communityId) {
        
        let findCommunityById = await this.LocationController.SearchCommunityById(communityId);
        if (findCommunityById.error) {
            
            let findCommunityByName = await this.LocationController.SearchCommunityByName(this.MakeFirstLetterUpperCase(communityId));
            if (findCommunityByName.error) {
                return {
                    error: true,
                    message: `No community was found for '${communityId}'`
                }
            } 
            
            if (findCommunityByName.result == null) {
                return {
                    message: `No community was found for '${communityId}'`,
                    error: true
                }
            }

            if (findCommunityByName.result != null) {
                return {
                    result: findCommunityByName.result._id,
                    error: false
                }
            }

        } else {
            return {
                result: findCommunityById.result._id,
                error: false
            }
        }

    }

    ArrangeProductByTime (productResult) {
        
        let productTime = [];

        for (let product of productResult) {
            productTime.push({
                productId: product.id,
                timer: product.created.getTime()
            })
        }

        console.log(productTime);

        return

        productTime.sort((a,b) => a-b)
        
        let newRecord = [];

        for (let product of productResult) {
            for (let timeOfUpload of productTime) {
                if (timeOfUpload == product.created.getTime()) {
                    newRecord.push(product)
                    break
                }
            }
        }

        return newRecord
    }

    async initiateAdvancedSearch(communityId, queryString, page = 1) {

        if (queryString.length < 1 || communityId.length == 0) return this.returnMethod(null, null, 500, false, "You did not provide a search string")

        let checkCommunity = await this.CheckCommunity(communityId);
        if (checkCommunity.error) return this.returnMethod(null, null, 500, false, checkCommunity.message)
        
        communityId = checkCommunity.result

        let productSearch = await this.performAdvancedSearch(communityId, queryString, page)

        if (productSearch.error) return this.returnMethod(null, null, 500, false, "An error occurred from our end. Kindly try again");

        let productResult = [];

        if (productSearch.error == true) {
            productResult = [];
        } else {

            productResult = productSearch.result;

            let scoreProduct = this.scoreProductResult(productResult);
            productResult = scoreProduct
        }
        
        let businessSearch = await this.BusinessSearch(communityId, page);

        let businessList;
        
        if (businessSearch.error){
            businessList = []
        } else {
            businessList = businessSearch.result
        }

        return this.returnMethod(productResult, businessList, 200, true, "Search successful")

    }
}