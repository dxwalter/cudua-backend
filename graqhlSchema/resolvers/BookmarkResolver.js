
let createBookmark = require('../../Controllers/bookmarks/action/createBookmark');
let DeleteBookmark = require('../../Controllers/bookmarks/action/removeBookmark');

module.exports = {
    Query: {

    },
    Mutation: {
        createBookmark (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let create = new createBookmark();
            return create.createBookmark(args.input.businessId, userId);

        },
        deleteBookmark (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let deleteBookmark = new DeleteBookmark();
            return deleteBookmark.removeBookmark(args.input.businessId, userId);

        }
    }
}