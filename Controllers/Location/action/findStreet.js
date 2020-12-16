'use-strict'

const LocationController = require('../LocationController');
const CreateNotification = require('../../notifications/action/createNotification')

module.exports = class FindLocation extends LocationController {
    constructor () {
        super()
        this.createNotification = new CreateNotification()
    }

    returnMethod (code, success, message) {
        return {
            code: code,
            success: success,
            message: message
        }
    }

    returnCustomerRequestedLocation (location, code, success, message) {
        return {
            location: location,
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

    returnLGAListMethod (lgaData, code, success, message) {
        return {
            lgas: lgaData,
            code: code,
            success: success,
            message: message
        }
    }

    returnCommunitiesListMethod (communityList, code, success, message) {
        return {
            communities: communityList,
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

    async GetAllStreetsInACommunity (communityId) {
        
        if (communityId.length == 0) return this.returnStreetMethod(null, 200, false, 'Choose a community');

        let findStreetsIncommunity = await this.findAllStreetsInCommunity(communityId);

        if (findStreetsIncommunity.error || findStreetsIncommunity.result == null) return this.returnStreetMethod(null, 200, false, 'No result was found');

        let formatStreetData = this.FormatStreetData(findStreetsIncommunity.result);
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
        countryId = '5f41789d3affd42e5892fac2';

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

    async GetLgaForState (stateId) {
        
        if (stateId.length == 0) return this.returnLGAListMethod(null, 500, false, "The  state data was not provided");

        let getAllLgasInState = await this.GetAllLgasInState(stateId);
        if (getAllLgasInState.error || getAllLgasInState.result == null) return this.returnLGAListMethod(null, 500, false, "An error occurred.");


        let sortLga = this.SortLocationAlphabetically(getAllLgasInState.result)

        // format data
        let newLgaArray = [];

        Array.from(sortLga, x => {
            newLgaArray.push({
                name: x.name,
                lgaId: x._id,
            });
        });

        return this.returnLGAListMethod(newLgaArray, 200, true, "Lgas retrieved")

    }

    trimArrayData (arrayData) {

        let trimmedData = []

        arrayData.forEach(element => {
            let trimmedElement = element.toLowerCase().trim()
            trimmedData.push(trimmedElement[0].toUpperCase() +  trimmedElement.slice(1))
        });
        
        let removeDuplicate = Array.from(new Set(trimmedData))
        return removeDuplicate;

    }

    async GetAllCommunitiesInLga (lgaId) {
        
        if (lgaId.length == 0) return this.returnCommunitiesListMethod(null, 200, false, "Lga data was not provided");

        let getAllCommunitiesInLga = await this.GetAllCommunitiesInAnLga(lgaId);
        if (getAllCommunitiesInLga.error || getAllCommunitiesInLga.result == null) return this.returnCommunitiesListMethod(null, 500, false, "An error occurred.");


        let sortCommunities = this.SortLocationAlphabetically(getAllCommunitiesInLga.result)

        // format data
        let newCommunityArray = [];

        Array.from(sortCommunities, x => {
            newCommunityArray.push({
                name: x.name,
                communityId: x._id,
            });
        });

        return this.returnCommunitiesListMethod(newCommunityArray, 200, true, "communities retrieved")

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
            country_id: '5f41789d3affd42e5892fac2',
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

        this.createNotification.CreateAdminNotification(userId, "Location", "New Location", `A customer is requesting that his/her location be added. Click here to learn more`);

        return this.returnMethod(200, true, "Your location is undergoing review. It will take at most 30 minutes to get to be up for use")

    }

    async getCustomerLocation () {

        let getNewLocation = await this.getAllCustomerAddedLocation()
        
        if (getNewLocation.error) return this.returnCustomerRequestedLocation(null, 500, false, getNewLocation.message);

        let dataArray = [];

        for (let x of getNewLocation.result) {
            dataArray.push({
                itemId: x._id,
                userId: x.user_id,
                state: x.state.name,
                lga: x.lga,
                community: x.community,
                street: x.street,
                proximity: x.proximity
            })
        }

        return this.returnCustomerRequestedLocation(dataArray, 200, true, "Data retrieved")

    }

    async deleteCustomerAddedLocation (itemId) {

            if (itemId.length == 0) return this.returnMethod(200, false, "An error occurred. Kindly refresh page and try again");

            let deleteLocation = await this.deleteCustomerAddedLocationFromDb(itemId);

            return this.returnMethod(200, true, "Deleted successfully")

    }

    async saveStreetNewLocation (stateId, lgaId, communityId, streets) {
        let countryId = '5f41789d3affd42e5892fac2';

        if (stateId.length == 0 || lgaId.length == 0 || communityId.length == 0 || streets.length == 0) {
            return this.returnMethod(200, false, "Provide all the details required");
        }

        let streetArray = streets.split(',');

        let trimmedStreet = this.trimArrayData(streetArray);

        let nonExistingStreets = [];
        let passedStreet = 0;
        let failedStreet = 0;

        for (let street of trimmedStreet) {
            let checkStreet = await this.checkIfStreetExists(street, communityId, lgaId);
            if (checkStreet.error == false) {
                if (checkStreet.result == null) {
                    nonExistingStreets.push({
                        country_id: countryId,
                        state_id: stateId,
                        community_id: communityId,
                        lga_id: lgaId,
                        name: street
                    });
                    passedStreet = passedStreet + 1
                } else {
                    failedStreet = failedStreet + 1
                }
            } else {
                failedStreet = failedStreet + 1
            }
        }

        
        if (passedStreet > 0) {

            let saveManyStreets = await this.saveManyStreets(nonExistingStreets);

            if (saveManyStreets.error == true) return this.returnMethod(200, false, "An error occurred saving your streets.");

            return this.returnMethod(200, true, `${passedStreet} street(s) saved. ${failedStreet} street(s) failed.`);

        } else {
            return this.returnMethod(200, false, "All these street(s) already exist");
        }
    }

    async saveCommunitiesNewLocation (stateId, lgaId, newCommunities) {

        let countryId = '5f41789d3affd42e5892fac2';

        if (stateId.length == 0 || lgaId.length == 0 || newCommunities.length == 0) {
            return this.returnMethod(200, false, "Provide all the details required");
        }


        let communityArray = newCommunities.split(',');
        let trimmedCommunities = this.trimArrayData(communityArray);

        let nonExistingCommunities = [];
        let passedCommunity = 0;
        let failedCommunity = 0

        for (let community of trimmedCommunities) {
            let checkCommunity = await this.checkIfCommunityExists(community, stateId, lgaId);
            if (checkCommunity.error == false) {
                if (checkCommunity.result == null) {
                    nonExistingCommunities.push({
                        country_id: countryId,
                        state_id: stateId,
                        lga_id: lgaId,
                        name: community
                    });
                    passedCommunity = passedCommunity + 1
                } else {
                    failedCommunity = failedCommunity + 1
                }
            } else {
                failedCommunity = failedCommunity + 1
            }
        }

        if (passedCommunity > 0) {

            let saveManyCommunities = await this.saveManyCommunities(nonExistingCommunities);

            if (saveManyCommunities.error == true) return this.returnMethod(200, false, "An error occurred saving your communities.");

            return this.returnMethod(200, true, `${passedCommunity} community(s) saved. ${failedCommunity} community(s) failed.`);

        } else {
            return this.returnMethod(200, false, "All these community(ies) already exist");
        }

    }


    async saveLgasNewLocation(stateId, newLgas) {

        let countryId = '5f41789d3affd42e5892fac2';

        if (stateId.length == 0 || newLgas.length == 0) {
            return this.returnMethod(200, false, "Provide all the details required");
        }

        let lgaArray = newLgas.split(',');
        let trimmedLgas = this.trimArrayData(lgaArray);

        let nonExistingLga = [];
        let passedLga = 0;
        let failedLga = 0;

        for (let lga of trimmedLgas) {
            let checkLga = await this.checkIfLgaExists(lga, stateId);
            if (checkLga.error == false) {
                if (checkLga.result == null) {
                    nonExistingLga.push({
                        country_id: countryId,
                        state_id: stateId,
                        name: lga
                    });
                    passedLga = passedLga + 1
                } else {
                    failedLga = failedLga + 1
                }
            } else {
                failedLga = failedLga + 1
            }
        }


        if (passedLga > 0) {

            let saveManyLgas = await this.saveManyLgas(nonExistingLga);

            if (saveManyLgas.error == true) return this.returnMethod(200, false, "An error occurred saving your Lgas.");

            return this.returnMethod(200, true, `${passedLga} Lga(s) saved. ${failedLga} lga(s) failed.`);

        } else {
            return this.returnMethod(200, false, "All these lgas already exist");
        }
        
    }
}