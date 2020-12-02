'use-strict'

const MainFunction = require('../MainFunction')

const StreetModel = require('../../Models/LocationStreet');
const CommunityModel = require('../../Models/LocationCommunity');
const StateModel = require('../../Models/LocationState');
const LGAModel = require('../../Models/LocationLga');

const NewLocationModel = require('../../Models/NewLocations');

module.exports = class LocationController extends MainFunction {
    
    constructor () {
        super()
    }

    async CheckCommunity(communityId) {
    

        let findCommunityById = await this.SearchCommunityById(communityId);
        
        if ((findCommunityById.error == false && findCommunityById.result == null) || findCommunityById.error) {
            
            let findCommunityByName = await this.SearchCommunityByName(this.MakeFirstLetterUpperCase(communityId));

            if (findCommunityByName.error == false && findCommunityByName.result == null) {
                return {
                    error: true,
                    message: `No community was found with the name '${communityId}'`
                }
            } 
            
            if (findCommunityByName.error) {
                return {
                    message: `No community was found with the name '${communityId}'`,
                    error: true
                }
            }

            if (findCommunityByName.result != null && findCommunityByName.error == false) {
                return {
                    result: findCommunityByName.result._id,
                    error: false
                }
            }

        } else {
            return {
                result: findCommunityById.result._id,
                error: false
            }
        }

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

    async GetAllLgasInState (stateId) {

        try {
            let getAll = await LGAModel.find({state_id: stateId})
            return {
                result: getAll,
                error: false
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async GetAllCommunitiesInAnLga (lgaId) {

        try {
            let getAll = await CommunityModel.find({lga_id: lgaId})
            return {
                result: getAll,
                error: false
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


    async checkIfStreetExists(street, communityId, lgaId) {

        try {
            let getStreet = await StreetModel
            .findOne({
                $and: [
                    {
                        lga_id: lgaId, 
                        community_id: communityId,
                        name: street
                    }
                ]
            });

            return {
                result: getStreet,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async checkIfCommunityExists(community, stateId, lgaId) {

        try {
            let getCommunity = await CommunityModel
            .findOne({
                $and: [
                    {
                        lga_id: lgaId, 
                        state_id: stateId,
                        name: community
                    }
                ]
            });

            return {
                result: getCommunity,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }
    async checkIfLgaExists(lga, stateId) {

        try {
            let getLga = await LGAModel
            .findOne({
                $and: [
                    {
                        state_id: stateId,
                        name: lga
                    }
                ]
            });

            return {
                result: getLga,
                error: false
            }

        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }

    }

    async saveManyStreets (streets) {
        try {
            let saveMany = await StreetModel.insertMany(streets);

            return {
                error: false,
                result: saveMany
            }

        } catch (error) {

            console.log(error)
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async saveManyCommunities (communities) {
        try {
            let saveMany = await CommunityModel.insertMany(communities);

            return {
                error: false,
                result: saveMany
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }
    async saveManyLgas (lgas) {
        try {
            let saveMany = await LGAModel.insertMany(lgas);

            return {
                error: false,
                result: saveMany
            }

        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }

        }
    }

    async findAllStreetsInCommunity (communityId) {
        
        try {
            let findStreets = await StreetModel.find({community_id: communityId})
            .populate('country_id')
            .populate('state_id')
            .populate('lga_id')
            .populate('community_id')
            .populate('proximity.street')
            .sort({_id: -1})

            return {
                error: false,
                result: findStreets
            }
        } catch (error) {
            
            return {
                error: true,
                message: error.message
            }
        }

    }
}