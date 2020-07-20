'use-strict'

const LocationController = require('../LocationController');

module.exports = class FindLocation extends LocationController {
    constructor () {
        super()
    }

    returnMethod (streetData, code, success, message) {
        return {
            streetData: streetData,
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
            return this.returnMethod(null, 200, false, 'Type the name of your street')
        }

        let getStreet = await this.SearchStreet(keyword);

        if (getStreet.error == true) {
            return this.returnMethod(null, 500, false, 'Something went wrong. Please try again')
        }

        if (getStreet.result.length < 1) {
            return this.returnMethod(null, 200, false, 'No result was found')
        }

        let formatStreetData = this.FormatStreetData(getStreet.result);
        return this.returnMethod(formatStreetData, 200, true, `Street search was successful`)

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
            return this.returnCommunityMethod(null, 200, false, 'No result was found')
        }

        let formatCommunityData = this.FormatCommunityData(getCommunity.result);

        return this.returnCommunityMethod(formatCommunityData, 200, true, `community search was successful`)

    }
}