'use-strict'

const subscriptionController = require('../subscriptionController')
const BusinessController = require('../../business/BusinessController');
const SubscriptionModel = require('../../../Models/SubscriptionModel');

module.exports = class createSubScription extends subscriptionController {
    
    constructor () {
        super();
        this.businessController = new BusinessController()
    }

    async createNewSubscription (businessId, referenceId, type = "basic", newBusiness = 0) {

        // free subscription
        if (newBusiness == 1) {

            let create = new SubscriptionModel({
                business_id: businessId,
                type: type,
                transaction_ref: referenceId,
            });

            let createNew = await this.saveSubscription(create);

            if (createNew == false) {
                return {
                    error: true,
                    message: createNew.message
                }
            } else {
                return {
                    result: createNew.result,
                    error: false
                }
            }

        }

    }

}