

const OrderController = require('../orderController');
const CartController = require('../../cart/CartController');

module.exports = class createOrder extends OrderController {
    constructor () {
        super();
        this.cartController = new CartController();
    }
}