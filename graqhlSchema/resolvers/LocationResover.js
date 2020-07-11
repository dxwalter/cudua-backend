
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

        }
    }
}