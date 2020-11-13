"use-strict"

const CreateSubscriber = require('../../Controllers/emailSubscriber/action/createSubscriber')

module.exports = {
    Mutation: {
        CreateNewEmailSubcriber(_, args) {

            let create = new CreateSubscriber();
            return create.CreateSubscriber(args.input.email)
        }
    }
}