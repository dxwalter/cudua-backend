'use-strict'

const FunctionRepo = require('../MainFunction');
const SubscriptionModel = require('../../Models/SubscriptionModel');
const SubscriptionReference = require('../../Models/SubscriptionReference');

module.exports = class SubscriptionController extends FunctionRepo {
    constructor () { 
        super()
    }

    async getLastSubscriptionRef (businessId) {

        try {
            
            let getRef = await SubscriptionReference.findOne({business_id: businessId})
            .sort({_id: -1});

            return {
                result: getRef,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

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

    async findOneAndUpdate (businessId, newData) {
        try {
            let updateRecord = await SubscriptionModel.findOneAndUpdate({business_id: businessId}, { $set:newData }, {new : true });
            return {
                error: false,
                result: updateRecord
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async createSubscriptionReference(businessId, referenceId) {
        try {
                
            let data = new SubscriptionReference({
                business_id: businessId,
                ref_id: referenceId,
                amount: 700
            });

            let save = await data.save();

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

    async getLastSubscription (businessId) {
        try {
            let latestRecord = await SubscriptionModel.findOne({business_id: businessId});
            return {
                error: false,
                result: latestRecord
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
}