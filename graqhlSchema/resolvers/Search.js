
const RegularSearch = require('../../Controllers/search/regularSearch')

module.exports = {
    Query: {
        RegularSearch (_, args) {
            args = args.input
            let createSearch = new RegularSearch();
            return createSearch.InitiateSearch(args.queryString, args.page)
        }
    },
    Mutation: {}
}