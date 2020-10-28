'use-strict'

const MainFunction = require('../MainFunction')

const StreetModel = require('../../Models/LocationStreet');
const CommunityModel = require('../../Models/LocationCommunity');
const StateModel = require('../../Models/LocationState');
const LGAModel = require('../../Models/LocationLga');

const NewLocationModel = require('../../Models/NewLocations');

module.exports = class LocationController extends MainFunction{
    
    constructor () {
        super()
    }

    async SearchStreet(keyword) {
        try {

            let findStreet = await StreetModel.find({name: { $regex: '.*' + keyword + '.*', $options: 'i'}})
            .populate('country_id')
            .populate('state_id')
            .populate('lga_id')
            .populate('community_id')
            .populate('proximity.street')
            .sort({_id: -1})
            .limit(6)

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

    async SearchLGA (keyword) {
        try {

            let findLga = await LGAModel.find({name: { $regex: '.*' + keyword + '.*', $options: 'i'}})
            .populate('state_id')
            .sort({_id: -1})
            .limit(5)

            return {
                error: false,
                result: findLga
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

    async SearchCommunityById (id) {
        try {

            let findCommunity = await CommunityModel.findOne({_id: id})
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

    async SearchCommunityByName (name) {
        try {

            let findCommunity = await CommunityModel.findOne({name: name})
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

    async GetAllStatesQuery (countryId) {
        
        try {

            let GetStates = await StateModel.find({country_id: countryId})
            .sort({_id: -1})
            .populate('country_id')

            return {
                error: false,
                result: GetStates
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }

    async AddNewLocation (data) {
        let create = new NewLocationModel(data);

        try {
            let save = create.save();
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
}