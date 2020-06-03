module.exports = {
    Query: {
        GetSingleBusinessDetails (parent, args, context, info) {
            console.log(args)
        }
    },
    Mutation: {
        CreateBusinessAcount(parent, args, context, info) {
            console.log(args)
        }
    }
}