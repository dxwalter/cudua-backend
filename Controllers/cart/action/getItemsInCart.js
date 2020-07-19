  
const CartController = require('../CartController');
const LocationController = require('../../Location/LocationController');

module.exports = class GetItemsInCart extends CartController {
    constructor () { 
        super();
        this.locationController = new LocationController();
    }

    returnMethod (cart, code, success, message) {
        return {
            cart: cart,
            code: code,
            success: success,
            message: message
        }
    }

    async getColor(id, colorArray) {
        for (let x of colorArray) {
            if (id == x._id) {
                return x.color_codes;
            }
        }
    }

    async getSize(id, sizeArray) {
        for (let x of sizeArray) {
            if (id == x._id) {
                return x.sizes;
            }
        }
    }

    async formatCartItems(getCartItems) {

        let cartArray = [];
        let streetObject = {};

        for (const [index, item] of getCartItems.entries()) {

            cartArray[index] = {
                itemId: item._id,
                customer: item.owner,
                product: {
                    productId: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.primary_image,
                    review: item.product.score
                },
                business: {
                    businessId: item.business._id,
                    name: item.business.businessname,
                },
                // get color and size from product's color and sizes array
                size: item.size == undefined ? null : await  this.getSize(item.size, item.product.sizes),
                color: item.color == undefined ? null : await this.getColor(item.color, item.product.colors),

                quantity: item.quantity
            }

            let dbStreetNumber = item.business.address.number;
            
            if (dbStreetNumber == undefined) {
                cartArray[index].business["address"] = null
            } else {


                let streetId = item.business.address.street;

                // check if street exists in object

                let getSavedLocation = streetObject.streetId;
                
                if (getSavedLocation == undefined) {

                    // get from db
                    let getLocationDetails = await this.locationController.SearchStreetById(streetId);
                    
                    if (getLocationDetails.error == true) {
                        // set location to null
                        cartArray[index].business.address = null;

                    } else {
                        // arrange and save to streetObject

                        let locationDetails = getLocationDetails.result[0];

                        streetObject[streetId] = {
                            street: locationDetails.name,
                            community: locationDetails.community_id.name,
                            lga: locationDetails.lga_id.name,
                            state: locationDetails.state_id.name,
                            country: locationDetails.country_id.name,
                        }

                        let getCartLocationData = streetObject[streetId]
                        cartArray[index].business["address"] = getCartLocationData
                        cartArray[index].business["address"]["number"] = dbStreetNumber

                    }
                } else {
                    let getCartLocationData = streetObject[streetId]
                    cartArray[index].business["address"] = getCartLocationData
                    cartArray[index].business["address"]["number"] = dbStreetNumber
                }
                
            }

        }


        return cartArray

    }

    async GetItemsByUserId (userId) {
        
        if (userId.length < 1) {
            return this.returnMethod(null, 500, false, `An error occurred from our end. log out and log into your account to continue`)
        }

        let getCartItems = await this.findItemsByUserId(userId);
        
        if (getCartItems.error) return this.returnMethod(null, 500, false, `An error occurred from our end. Please refresh and try again`);

        if (getCartItems.result.length == 0 || getCartItems == null) return this.returnMethod(null, 200, true, `You do not have any item in your cart`);

        let formatCartItems = await this.formatCartItems(getCartItems.result);

        return this.returnMethod(formatCartItems, 200, true, `Products in cart retrieved successfully`);

    }
}
