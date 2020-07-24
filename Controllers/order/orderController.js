'use-strict'

const FunctionRepo = require('../MainFunction');
const OrderModel = require('../../Models/OrderModel')

module.exports = class OrderController extends FunctionRepo {
    constructor () {
        super()
    }

    async checkIfOrderIdExists(orderId) {
        try {

            let find = await OrderModel.findOne({order_id: orderId});

            return {
                error: false,
                result: find
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async saveOrder(order) {
        try {
            
            let saveData = await OrderModel.insertMany(order);

            return {
                error: false,
                result: saveData
            }

        } catch (error) {
            return {
                error: true,
                messgae: error.message
            }
        }
    }

    async getItemFromOrder (orderId, productId, userId) {

        try {
            let findProduct = await OrderModel.findOne({
                $and: [
                    {
                        order_id: orderId, 
                        product: productId,
                        customer: userId
                    }
                ]
            })
            .populate("customer")
            .populate("product")
            .populate("business")

            return {
                error: false,
                result: findProduct
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }
    
    async deleteItemFromOrder (orderId, productId, userId) {
        try {
            
            let deleteItem = await OrderModel.deleteOne({
                $and: [{ customer: userId, order_id: orderId, product: productId}]
            })

            if (deleteItem.ok == 1 && deleteItem.deletedCount == 1) {
                return {
                    result: true,
                    error: false
                }
            } else {
                return {
                    result: false,
                    error: false
                }
            }
           
        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }
    }

    async getOrdersForBusiness(businessId) {

        try {
            let find = await OrderModel.find({business: businessId})
            .populate("customer")
            .sort({_id: -1})

            return {
                error: false,
                result: find
            }
            
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async findProductsInOrder(businessId, customerId, orderId) {

        try {
            
            let find = await OrderModel.find({
                $and: [{ business: businessId, customer: customerId, order_id: orderId }]
            }).populate("product")

            return {
                result: find,
                error: false
            }
           
        } catch (error) {
            return {
                message: error.message,
                error: true
            }
        }

    }

    async confirmCustomerOrder (businessId, customerId, orderId, newObject) {

        try {
            
            let confirm = await OrderModel.updateMany({
                $and: [{
                        order_id: orderId, 
                        business: businessId,
                        customer: customerId
                    }]
                }, { $set:newObject }, {new : true });

                if (confirm.ok == 1) {
                    return {
                        error: false,
                        result: true
                    }
                } else {
                    return {
                        error: false,
                        result: false
                    }
                }


        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }

    }

}