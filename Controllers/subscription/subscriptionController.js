'use-strict'

const FunctionRepo = require('../MainFunction');
const SubscriptionModel = require('../../Models/SubscriptionModel');

module.exports = class SubscriptionController extends FunctionRepo {
    constructor () { 
        super()
    }

    async saveSubscription(newSubscription) {

        try {
            const create = await newSubscription.save();
            return {
                error: false,
                result: create
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async getSubscriptionById(subscriptionId) {
        try {
            
            let getSub = await SubscriptionModel.findById(subscriptionId);

            return {
                error: false,
                result: getSub
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }
}