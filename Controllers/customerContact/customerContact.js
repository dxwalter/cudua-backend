
'use-strict'

const CustomerContactController = require('./customerContactController');

module.exports = class customerContact extends CustomerContactController {
    constructor () {
        super()
    }

    returnData(code, success, message, countData = 0) {
        return {
            code, success, message, countData
        }
    }

    returnCustomers (customers, code, success, message) {
        return {
            customers, code, success, message
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

    async getIdealCustomersByIndustry(industry, page = 1) {
        
        if (industry.length == 0) {
            return this.returnCustomers([], 500, false, "Choose an industry")
        }

        let getContacts;

        if (industry == "All") {

            getContacts = await this.getAllIdealContacts(page)

        } else {
            getContacts = await this.getContactsByIndustry(industry, page);

            if (getContacts.error) return this.returnCustomers([], 500, false, "An error occurred retrieving the requested data");
        }

        let formattedData = [];

        for (let x of getContacts.result) {
            formattedData.push({
                name: x.businessname,
                location: x.location,
                type: x.type,
                phone_one: x.phone_one,
                phone_two: x.phone_two
            })
        }

        return this.returnCustomers(formattedData, 200, true, "Retrieved successfully")
    }

    async countIdealCustomers () {
        
        let fashion = await this.countIdealCustomerMethod("Fashion");
        
        if (fashion.error) fashion = 0

        fashion = fashion.count

        let beauty = await this.countIdealCustomerMethod("Beauty");
        
        if (beauty.error) beauty = 0

        beauty = beauty.count

        return {
            fashion: fashion,
            beauty: beauty,
            code: 200,
            success: true,
            message: "successful"
        }
        
    }
}