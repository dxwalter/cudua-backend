
let GetLocation = require('../../Controllers/Location/action/findStreet');

module.exports = {
    Query : {
        GetStreet(_, args) {

            args = args.input.keyword

            let findStreetSAction = new GetLocation();
            return findStreetSAction.FindStreet(args);

        }
    }
}