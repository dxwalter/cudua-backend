
const FunctionRepo = require('../MainFunction');
const CartModel = require('../../Models/CartModel');

module.exports = class CartController extends FunctionRepo {
    constructor () { super() }

    async createCartItem(item) {
        try {
            let save = await item.save();
            return {
                error: false,
                result: save
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async findItemInCart(businessId, productId) {
        try {
            
            let getItem = await CartModel
            .findOne({
                $and: [
                    {
                        business: businessId, 
                        product: productId
                    }
                ]
            })

            return {
                result: getItem,
                error: false
            }
           
        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }

    async findItemsByUserId(userId) {
        
        try {
            let getItems = await CartModel.find({owner: userId})
            .sort({_id: -1})
            .populate('business')
            .populate('product')

            return {
                error: false,
                result: getItems
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
}