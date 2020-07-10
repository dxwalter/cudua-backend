
const StreetModel = require('../../Models/LocationStreet');
const CommunityModel = require('../../Models/LocationCommunity');

module.exports = class LocationController  {
    constructor () {

    }

    async SearchStreet(keyword) {
        try {

            let findStreet = await StreetModel.find({name: { $regex: '.*' + keyword + '.*', $options: 'i'}})
            .populate('country_id')
            .populate('state_id')
            .populate('lga_id')
            .populate('community_id')
            .populate('proximity.street')
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
}