
const moveData = require('../../Controllers/moveCategories/action/moveData')

module.exports = {
    Query: {
    },
    Mutation: {
        MoveCategories (_, args) {
            let data = new moveData();
            return data.startHere()
        }
    } 

}