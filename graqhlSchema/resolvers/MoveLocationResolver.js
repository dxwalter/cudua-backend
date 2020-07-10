
let moveData = require('../../Controllers/dataMigration/action/moveData')

module.exports = {
    Query: {
    },
    Mutation: {
        moveData(_, args) {
            let move = new moveData();
            return move.startHere()
        }
    }
}