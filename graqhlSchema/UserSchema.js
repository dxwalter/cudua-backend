"use strict";

const graphql = require("graphql");
const  { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;


const UserType = new GraphQLObjectType ({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        password: {type: GraphQLString},
        displaPicture: {type: GraphQLString},
        businessId: {type: GraphQLString}

    })
})

const userQuery = new GraphQLObjectType ({
    name: 'Query',
    fields : {
        user: {
            type : UserType,
            args: {id: {type: GraphQLString}},
            resolve (parent, args) {
                // code to get 
                return ({
                    "name" : "Daniel Walter"
                })
            }
        },
        createUser : {
            type: UserType,
            args: {},
            resolve (parent, args) {
                console.log(args);
                return args;
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: userQuery })