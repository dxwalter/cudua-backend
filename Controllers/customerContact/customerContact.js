
'use-strict'

const CustomerContactController = require('./customerContactController');

module.exports = class customerContact extends CustomerContactController {
    constructor () {
        super()
    }

    returnData(code, success, message, countData = 0) {
        return {
            code: code,
            success: success,
            message: message,
            countData: countData
        }
    }

    async createContact (businessName, type, location, phoneOne, phoneTwo, ) {
        
        if (!businessName || !type || !location || !phoneOne) {
            return this.returnData(200, false, "Check your input values")
        }

        let create = await this.createData(businessName, type, location, phoneOne, phoneTwo);

        if (create.error == true) return this.returnData(500, false, create.message);

        return this.returnData(200, true, "Contact added", create.countData)
    }
}