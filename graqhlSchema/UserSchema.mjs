"use strict";
import apolloServer from 'apollo-server';
const  { ApolloServer, gql } = apolloServer


// const CreateUser = require('../Controllers/user/action/CreateUser');
// const LoginUser = require('../Controllers/user/action/LoginUser');
// const RecoverPassword = require('../Controllers/user/action/RecoverPassword');


export const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.


    # response type
    interface responseType {
        code: String!
        success: Boolean!
        message: String!
    }

    # This "User" type defines the queryable fields for every user in our data source.
    type User {
        id: ID!
        userId: String!
        name: String!
        email: String!
        phone: String
        displaPicture: String
        businessId: String
    }

    type createAccountResponse implements responseType {
        user: User!
    }

    # This is the input type for createAccount mutation
    input CreateAccountInput {
        fullname: String!
        email: String!
        password: String!
    }

    type Query {
        _empty: String
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).

    extends type Query {
        getUser: User
        getUsers: [User]
    }

    #This is the mutation type that will handle create account, forgot and recover pasword
    type Mutation {
        createUser(user: CreateAccountInput): createAccountResponse
    }
`;

export const resolvers = {
    Mutation: {
        createUser(parent, args, context, info) {
            console.log(args)
        }
    },
    Query: {
        getUser () {

        },
        getUsers () {

        }
    }
}