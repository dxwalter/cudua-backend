
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

    FormatStreetData(getStreet) {

        let streetDataArray = [];

        for (const [index, streetData] of getStreet.entries()) {
            streetDataArray[index] = {
                communityName: streetData.community_id.name,
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
}