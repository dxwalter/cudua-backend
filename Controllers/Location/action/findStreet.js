'use-strict'

const LocationController = require('../LocationController');

module.exports = class FindLocation extends LocationController {
    constructor () {
        super()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    returnStateMethod (stateData, countryData, code, success, message) {
        return {
            states: stateData,
            country: countryData,
            code: code,
            success: success,
            message: message
        }
    }

    returnStreetMethod (streetData, code, success, message) {
        return {
            streetData: streetData,
            code: code, 
            success: success,
            message: message
        }
    }


    returnLGAMethod (lgaData, code, success, message) {
        return {
            lgaData: lgaData,
            code: code, 
            success: success,
            message: message
        }
    }

    returnCommunityMethod (communityData, code, success, message) {
        return {
            communityData: communityData,
            code: code, 
            success: success,
            message: message
        }
    }

    FormatCommunityData (getCommunity) {
        
        let communityDataArray = [];

        for (const [index, communityData] of getCommunity.entries()) {
            communityDataArray[index] = {
                country: {
                    name: communityData.country_id.name,
                    countryId: communityData.country_id._id
                },
                state: {
                    name: communityData.state_id.name,
                    stateId: communityData.state_id._id
                },
                lga: {
                    name: communityData.lga_id.name,
                    lgaId: communityData.lga_id._id
                },
                
                communityName: communityData.name,
                communityId: communityData._id
    
            }
        }

        return communityDataArray;
    }

    FormatStreetData(getStreet) {
        
        let streetDataArray = [];

        for (const [index, streetData] of getStreet.entries()) {
            streetDataArray[index] = {
                country: {
                    name: streetData.country_id.name,
                    countryId: streetData.country_id._id
                },
                state: {
                    name: streetData.state_id.name,
                    stateId: streetData.state_id._id
                },
                lga: {
                    name: streetData.lga_id.name,
                    lgaId: streetData.lga_id._id
                },
                community: {
                    name: streetData.community_id.name,
                    communityId: streetData.community_id._id
                },
                streetName: streetData.name,
                streetId: streetData._id,

                closeBy: []
            }

            for (let closeBy of streetData.proximity) {
                streetDataArray[index].closeBy.push({
                    streetName: closeBy.street.name,
                    streetId: closeBy.street._id
                })
            }
        }

        return streetDataArray;

    }

    async FindStreet (keyword) {
        
        if (keyword.length < 1) {
            return this.returnStreetMethod(null, 200, false, 'Type the name of your street')
        }

        let getStreet = await this.SearchStreet(keyword);

        if (getStreet.error == true) {
            return this.returnStreetMethod(null, 500, false, 'Something went wrong. Please try again')
        }

        if (getStreet.result.length < 1) {
            return this.returnStreetMethod(null, 200, true, 'No result was found')
        }

        let formatStreetData = this.FormatStreetData(getStreet.result);
        return this.returnStreetMethod(formatStreetData, 200, true, `Street search was successful`)

    }

    async FindCommunity (keyword) {
        if (keyword.length < 1) {
            return this.returnCommunityMethod(null, 200, false, 'Type the name of your community')
        }

        let getCommunity = await this.SearchCommunity(keyword);

        if (getCommunity.error == true) {
            return this.returnCommunityMethod(null, 500, false, 'Something went wrong. Please try again')
        }

        if (getCommunity.result.length < 1) {
            return this.returnCommunityMethod(null, 200, true, 'No result was found')
        }

        let sortCommunity = this.SortLocationAlphabetically(getCommunity.result)
        let formatCommunityData = this.FormatCommunityData(sortCommunity);

        return this.returnCommunityMethod(formatCommunityData, 200, true, `community search was successful`)

    }

    async FindLga (keyword) {
        if (keyword.length < 1) {
            return this.returnLGAMethod(null, 200, false, 'Type the name of your LGA')
        }

        let getLga = await this.SearchLGA(keyword);

        if (getLga.error == true) {
            return this.returnLGAMethod(null, 500, false, 'Something went wrong. Please try again')
        }

        if (getLga.result.length < 1) {
            return this.returnLGAMethod(null, 200, true, 'No result was found')
        }

        let sortLga = this.SortLocationAlphabetically(getLga.result)

        // format data
        let newLgaArray = [];

        Array.from(sortLga, x => {
            newLgaArray.push({
                lga: {
                    name: x.name,
                    lgaId: x._id,
                },
                state: {
                    name: x.state_id.name,
                    stateId: x.state_id._id
                }
            });
        });

        return this.returnLGAMethod(newLgaArray, 200, true, `LGA search was successful`)

    }

    async GetAllStates (countryId) {
        countryId = '5f92f2a66f4c8907a4ac4142';

        if (countryId.length < 1) return this.returnStateMethod(null, null, 200, false, "Select a country to continue");

        let states = await this.GetAllStatesQuery(countryId);

        if (states.error) return this.returnStateMethod(null, null, 500, false, "An error occurred. Please try again");

        if (states.result.length < 1) return this.returnStateMethod(null, null, 200, true, "No state record was found");

        let countryData = {
            name: states.result[0].country_id.name,
            countryId: states.result[0].country_id._id
        };

        let formatState = this.SortLocationAlphabetically(states.result);
        
        let requestedData = []

        Array.from(formatState, x => {
            requestedData.push({
                name: x.name,
                stateId: x._id
            });
        });

        return this.returnStateMethod(requestedData, countryData, 200, true, "States retrieved successfully")

    }

    async addNewLocation(args) {
        let state = args.state;
        let userId = args.userId;
        let lga = args.lga
        let community = args.community
        let street = args.street
        let proximity = args.proximity

        if (userId.length < 1 || state.length < 1 || community.length < 1 || lga.length < 1 || street.length < 1) {
            return this.returnMethod(200, false, "Your inputs were not correct")
        }

        let saveLocation = await this.AddNewLocation({
            user_id: userId,
            state: state,
            lga: lga,
            community: community,
            street: street,
            proximity: proximity
        });

        if (saveLocation.error == true) {
            return this.returnMethod(500, false, `An error occurred. ${saveLocation.message}`)
        }

        return this.returnMethod(200, true, "Your location is undergoing review. It will take at most 30 minutes to get to be up for use")

    }
}