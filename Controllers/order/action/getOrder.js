"use-strict"

const OrderController = require('../orderController');
const BusinessController = require('../../business/BusinessController');
const CustomerReviews = require('../../customerReview/customerReviewController');
const CustomerData = require('../../user/UserController')

module.exports = class GetOrders extends OrderController {

    constructor () {
        super();
        this.businessController = new BusinessController();
        this.CustomerReviews = new CustomerReviews();
        this.CustomerData = new CustomerData()
    }

    returnMethod (data, code, success, message) {
        return {
            orders: data,
            code: code,
            success: success,
            message: message
        }
    }

    returnProductMethod (products, customerData, orderInfo, code, success, message) {
        return {
            orderDetails: products,
            customerDetails: customerData,
            orderInfo: orderInfo,
            code: code,
            success: success,
            message: message
        }
    }

    returnCount (count, code, success, message) {
        return {
            count: count,
            code: code,
            success: success, 
            message: message
        }
    }

    returnCustomerOrderDetails (orderDetails, code, success, message) {
        return {
            orderDetails: orderDetails,
            code: code,
            success: success,
            message: message
        }
    }

    formatAddress(customerData) {
    
        if (customerData.street == undefined) {
            return null
        } else {
            
            return {
                number: customerData.number,
                busStop: customerData.bus_stop,
                street: customerData.street.name,
                community: customerData.community.name,
                lga: customerData.lga.name,
                state: customerData.state.name,
                country: customerData.country.name
            }
        }
    }
  
    getOrderSize(orderOptionData, productOptionArray) {
        for(let x of productOptionArray) {
            if (x._id == orderOptionData) return x.sizes
        }
        
        return null;
    }

    getOrderColor(orderOptionData, productOptionArray) {
        for(let x of productOptionArray) {
            if (x._id == orderOptionData) return x.color_codes
        }
        
        return null;
    }

    formartOrderData(orderData) {
        let newOrder = [];
        let pendingOrder = [];
        let clearedOrder = [];
        let orderObject = {};

        for (let orderItem of orderData) {
            if (orderObject[orderItem.order_id] == undefined) {

                // new order that is yet to be confirmed
                if (orderItem.order_status == 0) {

                    newOrder.push({
                        customerName: orderItem.customer.fullname,
                        customerId: orderItem.customer._id,
                        profilePicture: orderItem.customer.profilePicture == undefined ? "" : orderItem.customer.profilePicture,
                        orderTime: orderItem.created,
                        orderId: orderItem.order_id,
                    })
                }

                if (orderItem.order_status == 1 &&  orderItem.delivery_status != 1) {
                    pendingOrder.push({
                        customerName: orderItem.customer.fullname,
                        customerId: orderItem.customer._id,
                        profilePicture: orderItem.customer.profilePicture == undefined ? "" : orderItem.customer.profilePicture,
                        orderTime: orderItem.created,
                        orderId: orderItem.order_id,
                    })
                }

                // to check if an order has been cleared, the order status and delivery status must be 1
                if (orderItem.order_status && orderItem.delivery_status) {
                    clearedOrder.push({
                        customerName: orderItem.customer.fullname,
                        customerId: orderItem.customer._id,
                        profilePicture: orderItem.customer.profilePicture == undefined ? "" : orderItem.customer.profilePicture,
                        orderTime: orderItem.created,
                        orderId: orderItem.order_id,
                    })
                }

                // this is used to avoid returning more than one order id
                orderObject[orderItem.order_id] = "set"
            }
        }

        return {
            newOrder: newOrder.length > 0 ? newOrder : null,
            pendingOrder: pendingOrder.length > 0 ? pendingOrder : null,
            clearedOrder: clearedOrder.length > 0 ? clearedOrder : null
        }

    }

    async getOrderListingForBusiness (businessId, userId) {

        if (businessId.length < 1) return this.returnMethod(null, 200, false, "Your business credential was not provided.")  

        // check if business exists
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnMethod(null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return this.returnMethod(null, 200, false, `You can not access this functionality. You do not own a business`)
            }
        }

        let getOrdersForBusiness = await this.getOrdersForBusiness(businessId);
        let formatOrder = this.formartOrderData(getOrdersForBusiness.result);

        return this.returnMethod(formatOrder, 200, true, "Orders retrieved successfully")
    }

    async searchForOrder (businessId, orderId) {
 
        if (!businessId || !orderId) {
            return this.returnMethod(null, 200, false, "An error occurred. Type your order id")
        }

        let searchOrder = await this.searchOrderById(businessId, orderId);
        
        if (searchOrder.error) return this.returnMethod(null, 500, false, "An error occurred. Kindly try again");

        if (searchOrder.result.length == 0) return this.returnMethod([], 200, true, "No result was found");

        let newArray = [];

        for (const x of searchOrder.result) {
            newArray.push({
                customerName: x.customer.fullname,
                customerId: x.customer._id,
                profilePicture: x.customer.profilePicture == undefined ? "" : x.customer.profilePicture,
                orderTime: x.created,
                orderId: x.order_id,
            })
        }

        return this.returnMethod(newArray, 200, true, "Search complete");

    }

    async businessGetProductsInOrder(businessId, orderId, userId) {

        if (businessId.length < 1) return this.returnProductMethod(null, null, null, 200, false, "Your business credential was not provided.")  
        if (orderId.length < 1) return this.returnProductMethod(null, null, null, 200, false, "The order id was not provided was not provided.")  

        // check if business exists
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnProductMethod(null, null, null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner._id != userId) {
                return this.returnProductMethod(null, null, null, 200, false, `You can not access this functionality. Sign out and sign in to continue`)
            }
        }

        // get customer id
        let findCustomer = await this.findOneOrderForBusiness(businessId, orderId);
        
        if (findCustomer.error) return this.returnProductMethod(null, null, null, 200, false, "An error occurred from our end. Kindly try again.")
        
        let customerId = findCustomer.result.customer;

        let findProductsInOrder = await this.findProductsInOrder(businessId, customerId, orderId);
        
        if (findProductsInOrder.error) return this.returnProductMethod(null, null, null, 500, false, `An error occurred getting the products for order ${orderId}. Please try again`)
        
        findProductsInOrder = findProductsInOrder.result

        if (findProductsInOrder.length == 0) return this.returnProductMethod(null, null, null, 200, false, `No product was found for order ${orderId}. Please try again`)

        let customerReviews = findProductsInOrder.length < 1 || null ? [] : await this.CustomerReviews.getCustomerReviews(customerId);

        if (customerReviews != null) {
            if (customerReviews.error) return this.returnProductMethod(null, null, null, 500, `An error occurred while getting this customer's reviews by other businesses`)
        }

        

        let customerData = await this.CustomerData.findUsersById(customerId)
        if (customerData.error) return this.returnProductMethod(null, null, null, 500, `An error occurred while getting this customer's information`)

        customerData = customerData.result;

        // customer data
        let customerObject = {
            customerId: customerData._id,
            fullname: customerData.fullname,
            phoneNumber: customerData.phone,
            profilePicture: customerData.profilePicture == undefined ? "" : customerData.profilePicture,
            email: customerData.email,
            ratingScore: customerData.review_score,
            address: this.formatAddress(customerData.address)
        }

        // customer reviews

        if (customerReviews == null || customerReviews.length < 1) {
            customerObject["reviews"] = [];
        } else {

            customerReviews = customerReviews.result;

            customerObject["reviews"] = [];
            for (const [index, review] of customerReviews.entries()) {
                customerObject.reviews[index] = {
                    rating: review.rating,
                    description: review.description.length < 1 || review.description == undefined ? '' : review.description,
                    author: review.business_id.businessname,
                    businessId: review.business_id._id,
                    customerId: review.customer_id,
                    logo: review.business_id.logo.length < 1 || review.business_id.logo.undefined ? '' : review.business_id.logo,
                    timeStamp: review.created
                }
            }
        }

        // order details like delivery charge, order status etc
        let orderDetails = await this.getOrderMetaData(customerId, businessId, orderId);

        if (orderDetails.error) return this.returnProductMethod(null, null, null, 500, `An error occurred while getting this order information`);

        let orderInfo = {
            deliveryCharge: orderDetails.result.delivery_charge,
            orderStatus: orderDetails.result.order_status,
            deliveryStatus: orderDetails.result.delivery_status,
            deliveryTime: {
                start: orderDetails.result.delivery_time.start,
                end: orderDetails.result.delivery_time.end
            },
            orderTime: orderDetails.result.created,
            cancelOrderReason: orderDetails.result.customer_cancel_order_reason,
            customerCancelOrder: orderDetails.result.customer_cancel_order,
            BusinessRejectOrderReason: orderDetails.result.reject_order_reason,
            paymentMethod: orderDetails.result.payment_method,
            paymentStatus: orderDetails.result.payment_status
        }

        // product details
        let productList = [];

        for (const [index, orderProduct] of findProductsInOrder.entries()) {
            if (orderProduct.product != null) {
                productList.push({
                    name: orderProduct.product.name,
                    productId: orderProduct.product._id,
                    image: orderProduct.product.primary_image,
                    quantity: orderProduct.quantity,
                    price: orderProduct.product.price,
                    ratingScore: orderProduct.product.score,
                    size: orderProduct.size.length < 1 || orderProduct.size == undefined ? '' : this.getOrderSize(orderProduct.size, orderProduct.product.sizes),
                    color: orderProduct.color.length < 1 || orderProduct.color == undefined ? '' : this.getOrderColor(orderProduct.color, orderProduct.product.colors),
                    businessId: orderProduct.business
                })
            }
        }
        
        return this.returnProductMethod(productList, customerObject, orderInfo, 200, true, "ordered products retrieved successfully")

    }

    async getOrderCount(businessId) {
        
        let newOrderCount = await this.newOrderCount(businessId);
        if (newOrderCount.error) return this.returnCount(0, 500, false, "An error occurred");
        return this.returnCount(newOrderCount.result, 200, true, "Successful")

    }

    async GetCustomerOrderDetails (orderId, userId) {

        orderId = orderId.toUpperCase()

        if (userId.length == 0 || orderId.length == 0) return  this.returnCustomerOrderDetails(null, 200, false, "An error occurred. An incorrect data was passed. Refresh and try again");

        let getOrder = await this.findAllorderByCustomerIdAndOrderId(userId, orderId);

        if (getOrder.error) return this.returnCustomerOrderDetails(null, 500, false, getOrder.message);

        let activeOrders = [];

        // this is to check if a customer had cancelled an order that is yet to be deleted by the business owner
        for (let x of getOrder.result) {
            if (x.customer_cancel_order == 0) {
                activeOrders.push(x)
            }
        }

        if (activeOrders.length == 0) return this.returnCustomerOrderDetails(null, 200, false, `No order was found for ${orderId}`)

        let mainData = [];

        for (const [index, y] of activeOrders.entries()) {
            mainData.push({
                businessData: {
                    businessName: y.business.businessname,
                    username: y.business.username,
                    businessId: y.business.id,
                    logo: y.business.logo,
                    paystackPublicKey: y.business.paystackPublicKey
                },
                orderInfo: {
                    deliveryCharge: y.delivery_charge,
                    deliveryStatus: y.delivery_status,
                    deliveryTime: {
                        start: y.delivery_time.start,
                        end: y.delivery_time.end
                    },
                    orderTime: y.created,
                    cancelOrderReason: y.customer_cancel_order_reason,
                    customerCancelOrder: y.customer_cancel_order,
                    orderStatus: y.order_status,
                    BusinessRejectOrderReason: y.reject_order_reason,
                    paymentMethod: y.payment_method,
                    paymentStatus: y.payment_status
                },
                orderProduct: []
            })

            let allProductsInOrder = await this.findProductsInOrder(y.business.id, userId, orderId)


            if (allProductsInOrder.error) {
                return this.returnCustomerOrderDetails(null, 500, false, "An error occurred. Please try again")
                break;
            }

            if (allProductsInOrder.result.length == 0 || allProductsInOrder.result == null) {
                mainData[index].orderProduct = []
            } else {

                let dataProduct = allProductsInOrder.result;
                
                for (let data of dataProduct) {
                    
                    if (data.product != null) {
                        mainData[index].orderProduct.push({
                            name: data.product.name,
                            productId: data.product.id,
                            image: data.product.primary_image,
                            quantity: data.quantity,
                            price: data.product.price,
                            ratingScore: data.product.score,
                            size: data.size.length < 1 || data.size == undefined ? '' : this.getOrderSize(data.size, data.product.sizes),
                            color: data.color.length < 1 || data.color == undefined ? '' : this.getOrderColor(data.color, data.product.colors),
                            businessId: data.product.business_id
                        })
                    }
                }
            }
        }

        return this.returnCustomerOrderDetails(mainData, 200, true, "Order details retrieved successfully");
    }

    removeDuplicate (orderData) {
        let orderIdArray = [];

        if (orderData.length == 0) return []

        // Select all order id
        for (let x of orderData) {
            orderIdArray.push(x.orderId);
        }

        // new orderId Array
        let newOrderIdArray = new Set(orderIdArray);

        let formattedData = []

        for (let d of newOrderIdArray) {
            for (let y of orderData) {
                if(d === y.orderId) {
                    formattedData.push(y)
                    break
                }
            }
        }

        return formattedData
    }

    async GetCustomerOrderListingIds (userId) {
        
        let getAllOrder = await this.getAllOrdersByCustomer(userId);
        if (getAllOrder.error) return this.returnMethod(null, 500, false, "An error occurred from our end. Kindly try again.")

        if (getAllOrder.result.length == 0) return this.returnMethod({
            new: [],
            pending: [],
            cleared: []
        }, 200, true, "You are yet to order any product.");


        let newOrder = [];
        let pendingOrder = [];
        let clearedOrder = [];

        for (let order of getAllOrder.result) {
            if (order.order_status == -1) {
                newOrder.push({
                    orderId: order.order_id,
                    timeStamp: order.created
                })
            }

            if (order.order_status == 0) {
                newOrder.push({
                    orderId: order.order_id,
                    timeStamp: order.created
                })
            }

            if (order.order_status == 1 && order.delivery_charge > 0 && order.delivery_status == 0) {
                pendingOrder.push({
                    orderId: order.order_id,
                    timeStamp: order.created
                })
            } 

            if (order.order_status == 1 && order.delivery_charge > 0 && order.delivery_status == 1) {
                clearedOrder.push({
                    orderId: order.order_id,
                    timeStamp: order.created
                })
            } 
        }

        let formatNewOrder = this.removeDuplicate(newOrder)
        let formatPendingOrder = this.removeDuplicate(pendingOrder)
        let formatClearedOrder = this.removeDuplicate(clearedOrder)

        let orders = {
            new: formatNewOrder,
            pending: formatPendingOrder,
            cleared: formatClearedOrder
        }
        
        return this.returnMethod(orders, 200, true, "Order retrieved")
    }
}