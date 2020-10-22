'use-strict'

const FunctionRepo = require('../MainFunction');
const OrderModel = require('../../Models/OrderModel')
const OrderProductModel = require('../../Models/orderProductModel')

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
            
            let saveData = await OrderProductModel.insertMany(order);

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

    async saveBusinessOrder(data) {
        try {
            
            let saveData = await OrderModel.insertMany(data);

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

    async deleteOrderFromDb(orderId, customerId, businessId) {

        try {
            
            let deleteOrder = await OrderModel.deleteOne({
                $and: [
                    {
                        order_id: orderId,
                        customer: customerId,
                        business: businessId
                    }
                ]
            });

            if (deleteOrder.ok == 1) {
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
                error: true,
                message: error.message
            }   
        }
    }
    
    async deleteAllProductsInOrderFromDb(orderId, customerId, businessId) {

        try {
            
            let deleteOrder = await OrderProductModel.deleteMany({
                $and: [
                    {
                        order_id: orderId,
                        customer: customerId,
                        business: businessId
                    }
                ]
            });

            if (deleteOrder.ok == 1) {
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
                error: true,
                message: error.message
            }   
        }
    }

    async searchOrderById(businessId, orderId) {
        try {
            
            let findData = await OrderModel.find({
                $and: [
                    {
                        order_id:  { $regex: '.*' + orderId + '.*', $options: 'i'}, 
                        business: businessId
                    }
                ]
            }).populate("customer").limit(4)

            return {
                error: false,
                result: findData
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
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
            
            let deleteItem = await OrderProductModel.deleteOne({
                $and: [{ customer: userId, order_id: orderId, product: productId}]
            })

            if (deleteItem.ok == 1) {
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
            
            let find = await OrderProductModel.find({
                $and: [{ business: businessId, customer: customerId, order_id: orderId }]
            }).populate("product");

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

    async newOrderCount (businessId) {
        try {
            
            let getOrderCount = await OrderModel.countDocuments({
                $and: [{ business: businessId, order_status: 0 }]
            })

            
            return {
                result: getOrderCount,
                error: false
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async getOrderMetaData(customerId, businessId, orderId) {
        try {
            
            let query = await OrderModel.findOne({
                $and: [
                    {
                        customer: customerId, 
                        business: businessId,
                        order_id: orderId
                    }
                ]
            });

            return {
                result: query,
                error: false
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async CheckCustomerStatusWithBusiness (customer, business) {
        try {
            
            let query = await OrderModel.findOne({
                $and: [
                    {
                        customer: customer, 
                        business: business
                    }
                ]
            }, 'order_id');

            return {
                result: query,
                error: false
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async findAllorderByCustomerIdAndOrderId(customerId, orderId) {

        try {
            
            let findOrder = await OrderModel.find({
                $and: [
                    {
                        order_id: orderId,
                        customer: customerId
                    }
                ]
            }).populate("business")

            return {
                error: false,
                result: findOrder
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async checkIfProductExistsInOrder (customerId, productId) {
        try {
            
            let find = await OrderProductModel.findOne({
                $and: [{ customer: customerId, product: productId }]
            })

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

    async findOneOrderForBusiness (businessId, orderId) {
        try {
            
            let find = await OrderProductModel.findOne({
                $and: [{ business: businessId, order_id: orderId }]
            })

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

    async getAllOrdersByCustomer (userId) {
        try {
            let findOrder = await OrderModel.find({customer: userId})
            .sort({_id: -1})
            
            return {
                error: false,
                result: findOrder
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
}