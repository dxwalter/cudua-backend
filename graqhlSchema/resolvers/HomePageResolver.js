'use-strict'

let GetFollowingForHomePage = require('../../Controllers/homePage/action/getFollowing')

module.exports = {
    Query: {
        getHomePageFollowing (parent, args, context, info) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let getBookmark = new GetFollowingForHomePage();
            return getBookmark.getfollowingList(userId)
        }
    }
}