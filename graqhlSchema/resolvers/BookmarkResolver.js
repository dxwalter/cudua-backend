
let CreateBookmark = require('../../Controllers/bookmarks/action/createBookmark');
let DeleteBookmark = require('../../Controllers/bookmarks/action/removeBookmark');
let GetBookmark = require('../../Controllers/bookmarks/action/getBookmarks');
let GetBookmarkers = require('../../Controllers/bookmarks/action/getBookmarkers');

module.exports = {
    Query: {
        getBookmarks (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let getBookmark = new GetBookmark();
            return getBookmark.getMyBookmarks(userId);
            
        },
        getBookmakers(parent, args, context, info) {

            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let getBookmarkers = new GetBookmarkers();
            return getBookmarkers.myBookmarkers(args.input.businessId, userId);
        }
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

            let create = new CreateBookmark();
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