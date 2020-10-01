"use-strict"

const CustomerContact = require('../../Controllers/customerContact/customerContact')

module.exports = {
    Query: {
        getCustomers (_, args) {
            
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