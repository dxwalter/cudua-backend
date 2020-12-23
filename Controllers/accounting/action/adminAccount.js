"use-strict";

let AccountingController = require('../AccountingController');
let AnonymousCartController = require('../../anonymousCart/anonymousCartController')
let SignedCartController = require('../../cart/CartController');
let OrderController = require('../../order/orderController');
let ProductController = require('../../product/ProductController');
let FollowersController = require('../../follow/FollowController');
let BusinessController = require('../../business/BusinessController');
let CustomerController = require('../../user/UserController')

module.exports = class GetAdminAccount extends AccountingController {

    constructor () {
        super ()
        this.AnonymousCart = new AnonymousCartController();
        this.SignedCart = new SignedCartController();
        this.Order = new OrderController();
        this.Product = new ProductController();
        this.Followers = new FollowersController();
        this.Business = new BusinessController();
        this.Customers = new CustomerController()
    }

    async getAdminAccountData () {

        let allProducts = await this.Product.countAllProductsInCudua();

        let allBusinesses = await this.Business.countAllBusinessesInCudua()

        let allCustomers = await this.Customers.countAllCustomersInCudua()

        let signedCart = await this.SignedCart.countAllCartItemsInCudua();

        let anonymousCart = await this.AnonymousCart.countAllUnsignedCartItemsInCudua()

        let orders = await this.Order.countAllTheOrdersOnCudua()

        return {
            accountingData: {
                allProducts,
                allBusinesses,
                allCustomers,
                allProductsInCart: signedCart + anonymousCart,
                allOrders: orders
            },
            code: 200,
            success: true,
            message: "Data retrieved"
        }
    }

}