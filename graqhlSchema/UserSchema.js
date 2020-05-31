"use strict";

const express = require('express');
const graphqlHTTP = require("express-graphql");


const CreateUser = require('../Controllers/user/action/CreateUser');
const LoginUser = require('../Controllers/user/action/LoginUser');
const UserModel = require('../Models/UserModel');

const graphql = require("graphql");
const  {
            GraphQLObjectType, 
            GraphQLString, 
            GraphQLSchema, 
            buildSchema, 
            GraphQLNonNull, 
            GraphQLID, 
            GraphQLInt
       } = graphql;

const UserType = new GraphQLObjectType({
    name: 'inputType',
    description: "This is a user definition type",
    fields: {
        id: {type: GraphQLID},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        displaPicture: {type: GraphQLString},
        businessId: {type: GraphQLString}
    }
});


const outputType = new GraphQLObjectType({
    name: 'outputType',
    description: "This is a user output type",
    fields: {
        userId: {type: GraphQLID},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        displaPicture: {type: GraphQLString},
        businessId: {type: GraphQLString},
        businessData: {type: GraphQLString},
        accessToken: {type: GraphQLString},
        requestStatus: {type: GraphQLInt},
        requestMessage: {type: GraphQLString}
    }
});


const userQuery = new GraphQLObjectType ({
    name: 'userQuery',
    fields : {
        loginUser: {
            type : outputType,
            args: {
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve (parent, args, context) {
                // code to get 
                let loginUser = new LoginUser(args);
                return loginUser.AuthenticateUser();
            }
        },
        
    }
});

const userMutation = new GraphQLObjectType({
    name: "Mutation",
    fields : {
        createUser : {
            type: outputType,
            args: {
                fullname: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve (parent, args, context) {
                let createUser = new CreateUser(args);
                return createUser.validateUserInput();
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: userQuery, mutation: userMutation })