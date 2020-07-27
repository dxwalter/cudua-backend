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

    returnProductMethod (products, customerData, deliveryPrice, code, success, message) {
        return {
            orderDetails: products,
            customerDetails: customerData,
            deliveryCharge: deliveryPrice,
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
                        profilePicture: orderItem.customer.profilePicture == undefined ? null : orderItem.customer.profilePicture,
                        orderTime: orderItem.created,
                        orderId: orderItem.order_id,
                    })
                }

                if (orderItem.order_status &&  orderItem.delivery_status != 1) {
                    pendingOrder.push({
                        customerName: orderItem.customer.fullname,
                        customerId: orderItem.customer._id,
                        profilePicture: orderItem.customer.profilePicture == undefined ? null : orderItem.customer.profilePicture,
                        orderTime: orderItem.created,
                        orderId: orderItem.order_id,
                    })
                }

                // to check if an order has been cleared, the order status and delivery status must be 1
                if (orderItem.order_status && orderItem.delivery_status) {
                    clearedOrder.push({
                        customerName: orderItem.customer.fullname,
                        customerId: orderItem.customer._id,
                        profilePicture: orderItem.customer.profilePicture == undefined ? null : orderItem.customer.profilePicture,
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

        let customerReviews = findProductsInOrder.length < 1 || null ? null : await this.CustomerReviews.getCustomerReviews(customerId);
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
            phone: customerData.phone == undefined ? null : customerData.phone,
            profilePicture: customerData.profilePicture == undefined ? null : customerData.profilePicture,
            email: customerData.email,
            ratingScore: customerData.review_score,
            address: customerData.address.street.length < 1 || customerData.address == undefined ? null: {
                number: customerData.address.number,
                busStop: customerData.address.bus_stop,
                street: customerData.address.street.name,
                community: customerData.address.community.name,
                lga: customerData.address.community.name,
                state: customerData.address.state.name,
                country: customerData.address.country.name
            }
        }

        // customer reviews

        if (customerReviews == null || customerReviews.length < 1) {
            customerObject["reviews"] = null;
        } else {

            customerReviews = customerReviews.result;

            customerObject["reviews"] = [];
            for (const [index, review] of customerReviews.entries()) {
                customerObject.reviews[index] = {
                    rating: review.rating,
                    description: review.description.length < 1 || review.description == undefined ? null : review.description,
                    author: review.business_id.businessname,
                    logo: review.business_id.logo.length < 1 || review.business_id.logo.undefined ? null : review.business_id.logo
                }
            }
        }

        let productList = [];
        let deliveryPrice = 0;

        for (const [index, orderProduct] of findProductsInOrder.entries()) {
            productList[index] = {
                name: orderProduct.product.name,
                productId: orderProduct.product._id,
                avatar: orderProduct.product.primary_image,
                quantity: orderProduct.quantity,
                price: orderProduct.product.price,
                size: orderProduct.size.length < 1 || orderProduct.size == undefined ? null : this.getOrderSize(orderProduct.size, orderProduct.product.sizes),
                color: orderProduct.color.length < 1 || orderProduct.color == undefined ? null : this.getOrderColor(orderProduct.color, orderProduct.product.colors)
            }
            deliveryPrice = orderProduct.delivery_charge;
        }

        console.log(deliveryPrice)

        return this.returnProductMethod(productList, customerObject, deliveryPrice, 200, true, "ordered products retrieved successfully")

        

    }

    async getOrderCount(businessId) {
        
        let newOrderCount = await this.newOrderCount(businessId);
        if (newOrderCount.error) return this.returnCount(0, 500, false, "An error occurred");
        return this.returnCount(newOrderCount.result, 200, true, "Successful")

    }
}