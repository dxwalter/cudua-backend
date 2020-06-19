

const fs = require('fs');

module.exports = {
    Query: {

    },
    Mutation: {
        createProduct (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            console.log(args);
            return {
                code: 200,
                success: true,
                message: "good  "
            }

        }
    }
}