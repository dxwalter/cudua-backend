"use-strict";

let AccountingController = require('../AccountingController');
let AnonymousCartController = require('../../anonymousCart/anonymousCartController')
let SignedCartController = require('../../cart/CartController');
let OrderController = require('../../order/orderController');
let ProductController = require('../../product/ProductController');
let FollowersController = require('../../follow/FollowController');

module.exports = class GetAccount extends AccountingController {
    constructor () {
        super ()
        this.AnonymousCart = new AnonymousCartController();
        this.SignedCart = new SignedCartController();
        this.Order = new OrderController();
        this.Product = new ProductController();
        this.Followers = new FollowersController();
    }

    returnData (businessData, code, success, message) {
        return {
            businessData: businessData,
            code: code,
            success: success,
            message: message
        }
    }
    

    async getBusinessAccount (businessId) {
        
        if (businessId.length == 0) return this.returnData(null, 500, false, "An error occurred. Kindly refresh and try again.");

        let allProductCount = await this.Product.countBusinessProducts({business_id: businessId});

        let allOrderCount = await this.Order.allOrderCount(businessId);

        let allProductsInAnonymousCart = await this.AnonymousCart.allProductsInAnonymousCart(businessId);

        let allProductsInSignedCart = await this.SignedCart.allProductsInSignedCart(businessId);

        let allProductsInCart = allProductsInAnonymousCart + allProductsInSignedCart;

        let totalAmountSold = 0;


        let allTransactions = await this.getAllBusinessTransactions(businessId);

        let allFollowersCount = await this.Followers.allFollowersCount(businessId)

        if (allTransactions.error) return this.returnData(null, 500, false, "An error occurred. Kindly refresh and try again.");

        let formattedTransactions = [];

        for (let x of  allTransactions.result) {
            totalAmountSold = parseInt(totalAmountSold, 10) + parseInt(x.totalPrice, 10)
            if (x.userId != null) {
                formattedTransactions.push({
                    referenceId: x.referenceId,
                    orderId: x.orderId,
                    customerName: x.userId.fullname,
                    paymentMethod: x.paymentMethod,
                    amount: x.totalPrice,
                    date: x.created
                })
            }
        }

        let businessData = {
            allProducts: allProductCount,
            allOrders: allOrderCount,
            allProductsInCart: allProductsInCart,
            allFollowers: allFollowersCount,
            totalAmountSold: totalAmountSold,
            allTransactions: formattedTransactions
        }

        return this.returnData(businessData, 200, true, "Account retreived")

    }

}