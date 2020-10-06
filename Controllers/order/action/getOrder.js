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
            if (businessData.result.owner != userId) {
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

    async businessGetProductsInOrder(businessId, customerId, orderId, userId) {

        if (businessId.length < 1) return this.returnProductMethod(null, null, null, 200, false, "Your business credential was not provided.")  
        if (customerId.length < 1) return this.returnProductMethod(null, null, null, 200, false, "The customer's credential was not provided.")  
        if (orderId.length < 1) return this.returnProductMethod(null, null, null, 200, false, "The order id was not provided was not provided.")  

        // check if business exists
        let businessData = await this.businessController.getBusinessData(businessId);

        if (businessData.error == true) {
            return this.returnProductMethod(null, null, null, 200, false, "Your business is not recognised.")
        } else {
            // check if user is a valid business owner
            if (businessData.result.owner != userId) {
                return this.returnProductMethod(null, null, null, 200, false, `You can not access this functionality. Sign out and sign in to continue`)
            }
        }

        let findProductsInOrder = await this.findProductsInOrder(businessId, customerId, orderId);
        
        if (findProductsInOrder.error) return this.returnProductMethod(null, null, null, 500, false, `An error occurred getting the products for order ${orderId}. Please try again`)
        
        findProductsInOrder = findProductsInOrder.result
        if (findProductsInOrder < 1) return this.returnProductMethod(null, null, null, 200, false, `No product was found for order ${orderId}. Please try again`)

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
            cancelDeliveryReason: orderDetails.result.cancel_delivery_reason,
            customerCancelOrder: orderDetails.result.customer_cancel_order
        }

        // product details
        let productList = [];

        for (const [index, orderProduct] of findProductsInOrder.entries()) {
            productList[index] = {
                name: orderProduct.product.name,
                productId: orderProduct.product._id,
                image: orderProduct.product.primary_image,
                quantity: orderProduct.quantity,
                price: orderProduct.product.price,
                size: orderProduct.size.length < 1 || orderProduct.size == undefined ? '' : this.getOrderSize(orderProduct.size, orderProduct.product.sizes),
                color: orderProduct.color.length < 1 || orderProduct.color == undefined ? '' : this.getOrderColor(orderProduct.color, orderProduct.product.colors),
                businessId: orderProduct.business
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

    }
}