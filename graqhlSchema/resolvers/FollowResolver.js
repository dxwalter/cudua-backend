
'use-strict'

const FollowBusiness = require('../../Controllers/follow/action/FollowBusiness')
const GetFollow = require('../../Controllers/follow/action/GetFollowing')

module.exports = {
    Query: {
        Getfollowing (parent, args, context, info) {
            let accessToken = context.accessToken;

            let userId = context.authFunction(accessToken);
            if (userId.error == true) return userId
            userId = userId.message;

            let getFollow = new GetFollow();
            return getFollow.CustomerGetFollowing(args.input.page, userId);
            
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
        FollowBusiness (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let create = new FollowBusiness();
            return create.createFollow(args.input.businessId, userId);

        },
        UnfollowBusiness (parent, args, context, info) {
            let accessToken = context.accessToken;
            let userId = context.authFunction(accessToken);
            if (userId.error == true) {
                return userId
            } else {
                userId = userId.message;
            }

            let deleteFollow = new FollowBusiness();
            return deleteFollow.deleteFollow(args.input.businessId, userId);

        }
    }
}