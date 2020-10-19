
const RegularSearch = require('../../Controllers/search/regularSearch')
const RegularSearchCount = require('../../Controllers/search/searchCount')

module.exports = {
    Query: {
        RegularSearch (_, args) {
            args = args.input
            let createSearch = new RegularSearch();
            return createSearch.InitiateSearch(args.queryString, args.page)
        },
        RegularSearchResultCount (_, args) {
            args = args.input
            let searchCount = new RegularSearchCount();
            return searchCount.RunSearchCount(args.queryString)
        }
    },
    Mutation: {}
}