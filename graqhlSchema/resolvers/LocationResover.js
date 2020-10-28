
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
        }
    },
    Mutation: {
        AddNewUserLocation (_, args) {
            args = args.input;
            let findLocation = new GetLocation();
            return findLocation.addNewLocation(args)
        }
    }
}