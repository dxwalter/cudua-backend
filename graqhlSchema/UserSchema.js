"use strict";

const graphql = require("graphql");
const  { GraphQLObjectType, GraphQLString, GraphQLSchema, buildSchema, GraphQLNonNull, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    description: "This is a user definition type",
    fields: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        fullname: {type: GraphQLNonNull(GraphQLString)},
        email: {type: GraphQLNonNull(GraphQLString)},
        phone: {type: GraphQLString},
        password: {type: GraphQLNonNull(GraphQLString)},
        displaPicture: {type: GraphQLString},
        businessId: {type: GraphQLString}
    }
});



const userQuery = new GraphQLObjectType ({
    name: 'userQuery',
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
        
    }
});

const userMutation = new GraphQLObjectType({
    name: "Mutation",
    fields : {
        createUser : {
            type: UserType,
            args: {
                fullname: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve (parent, args) {
                console.log(args);
                return args;
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: userQuery, mutation: userMutation })