
let GetLocation = require('../../Controllers/Location/action/findStreet');

module.exports = {
    Query : {
        GetStreet(_, args) {

            args = args.input.keyword

            let findLocation = new GetLocation();
            return findLocation.FindStreet(args);

        },
        GetCommunity(_, args) {
            
            args = args.input.keyword
            let findLocation = new GetLocation();
            return findLocation.FindCommunity(args);

        },
        GetLga(_, args) {
            
            args = args.input.keyword
            let findLocation = new GetLocation();
            return findLocation.FindLga(args);

        },
        GetAllStates(_, args) {
            // args = args.input.countryId
            let findLocation = new GetLocation();
            return findLocation.GetAllStates()
        },
        GetLgaForState (_, args) {

            let findLgas = new GetLocation();
            return findLgas.GetLgaForState(args.input.stateId)
        },
        GetAllCommunitiesInLga (_, args) {
            let getCommunities = new GetLocation();
            return getCommunities.GetAllCommunitiesInLga(args.input.lgaId)
        },
        GetStreetsInCommunity (_, args) {
            let getStreets = new GetLocation();
            return getStreets.GetAllStreetsInACommunity(args.input.communityId)   
        }
    },
    Mutation: {
        AddNewUserLocation (_, args) {
            args = args.input;
            let findLocation = new GetLocation();
            return findLocation.addNewLocation(args)
        },
        CreateNewStreet (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message

            let saveStreets = new GetLocation();
            return saveStreets.saveStreetNewLocation(args.input.stateId, args.input.lgaId, args.input.communityId, args.input.newStreets)
        },
        CreateNewCommunities (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message


            let saveCommunities = new GetLocation();
            return saveCommunities.saveCommunitiesNewLocation(args.input.stateId, args.input.lgaId, args.input.newCommunities)
        },
        CreateNewLgas (_, args, context) {
            let userId = context.authFunction(context.accessToken);
            if (userId.error === true) return userId
            userId = userId.message


            let saveLgas = new GetLocation();
            return saveLgas.saveLgasNewLocation(args.input.stateId, args.input.newLgas)
        }
    }
}