'use-strict'

let GetFollowingForHomePage = require('../../Controllers/homePage/action/getFollowing');
let GetProductsForHomePage = require('../../Controllers/homePage/action/getProducts');
let GetBusinessForHomePage = require('../../Controllers/homePage/action/getBusiness');

module.exports = {
    Query: {
        getHomePageFollowing (parent, args, context, info) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let getBookmark = new GetFollowingForHomePage();
            return getBookmark.getfollowingList(userId)
        },
        getHomePageProducts (_) {
            let getProducts = new GetProductsForHomePage();
            return getProducts.getNewProducts();
        },
        getNewBusinessListing (_) {
            let getBusiness = new GetBusinessForHomePage();
            return getBusiness.getBusinessForHomePage()
        }
    }
}