
const RegularSearch = require('../../Controllers/search/regularSearch')
const RegularSearchCount = require('../../Controllers/search/searchCount')
const AdvancedSearch = require('../../Controllers/search/advancedSearch')

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
        },
        AdvancedSearch(_, args) {
            args = args.input
            let advancedSearch = new AdvancedSearch();
            return advancedSearch.initiateAdvancedSearch(args.communityId, args.queryString, args.page)
        }
    },
    Mutation: {}
}