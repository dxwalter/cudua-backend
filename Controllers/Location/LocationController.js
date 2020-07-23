'use-strict'

const StreetModel = require('../../Models/LocationStreet');
const CommunityModel = require('../../Models/LocationCommunity');

module.exports = class LocationController  {
    
    constructor () {}

    async SearchStreet(keyword) {
        try {

            let findStreet = await StreetModel.find({name: { $regex: '.*' + keyword + '.*', $options: 'i'}})
            .sort({_id: -1})
            .populate('country_id')
            .populate('state_id')
            .populate('lga_id')
            .populate('community_id')
            .populate('proximity.street')
            .sort({_id: -1})
            .limit(5)

            return {
                error: false,
                result: findStreet
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async SearchStreetById(streetId) {

        try {

            let findStreet = await StreetModel.findOne({_id: streetId})
            .sort({_id: -1})
            .populate('country_id')
            .populate('state_id')
            .populate('lga_id')
            .populate('community_id')
            .populate('proximity.street')
            .sort({_id: -1})
            .limit(5);

            return {
                error: false,
                result: findStreet
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async SearchCommunity (keyword) {
        try {

            let findCommunity = await CommunityModel.find({name: { $regex: '.*' + keyword + '.*', $options: 'i'}})
            .sort({_id: -1})
            .populate('country_id')
            .populate('state_id')
            .populate('lga_id')
            .sort({_id: -1})
            .limit(5)

            return {
                error: false,
                result: findCommunity
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
}