  
const CartController = require('../CartController');

module.exports = class GetItemsInCart extends CartController {
    constructor () { super(); }

    returnMethod (cart, code, success, message) {
        return {
            cart: cart,
            code: code,
            success: success,
            message: message
        }
    }

    async GetItemsByUserId (userId) {
        
        if (userId.length < 1) {
            return this.returnMethod(null, 500, false, `An error occurred from our end. log out and log into your account to continue`)
        }

    }
}
