'use-strict';

const Getfollowing = require('../../follow/action/GetFollowing')

module.exports = class HomePageGetfollowing {

    constructor () {
        this.followingData = new Getfollowing()
    }

    returnData (following, code, success, message) {
        return {
            following: following,
            code: code,
            success: success,
            message: message
        }
    }

    async getfollowingList (userId) {
        
        let getData = await this.followingData.CustomerGetFollowing(1, userId);
        
        if (getData.success == false) return this.returnData([], getData.code, false, "An error occurred");

        let following = getData.following;

        if (following.length <= 3)  return this.returnData([], 200, true, `${following.length} business followed`);

        let followingArray = []

        for (const [index, follow] of following.entries()) {
            if (index == 7) break
            followingArray.push({
                logo: follow.logo,
                businessName: follow.businessName,
                username: follow.username,
                businessId: follow.businessId,
                address: follow.address
            });
        }

        return this.returnData(followingArray, 200, true, `Data retrieved`);

    }
}