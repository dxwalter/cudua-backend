"use-strict"

const CustomerContact = require('../../Controllers/customerContact/customerContact')

module.exports = {
    Query: {
        getIdealCustomers (_, args, context) {
            args = args.input
            let contact = new CustomerContact();
            return contact.getIdealCustomersByIndustry(args.industry, args.page)
        },
        countIdealCustomers (_) {
            let countCustomers = new CustomerContact();
            return countCustomers.countIdealCustomers()
        }
    },
    Mutation: {
        createIdealCustomer(_, args) {
            args = args.input
            let contact = new CustomerContact();
            return contact.createContact(args.name, args.type, args.location, args.phone_one, args.phone_two)
        }
    }
}