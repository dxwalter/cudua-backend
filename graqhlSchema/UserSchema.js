"use strict";

const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require("crypto");


const CreateUser = require('../Controllers/user/action/CreateUser');
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
        id: {type: new GraphQLNonNull(GraphQLID)},
        fullname: {type: GraphQLNonNull(GraphQLString)},
        email: {type: GraphQLNonNull(GraphQLString)},
        phone: {type: GraphQLString},
        password: {type: GraphQLNonNull(GraphQLString)},
        displaPicture: {type: GraphQLString},
        businessId: {type: GraphQLString}
    }
});


const outputType = new GraphQLObjectType({
    name: 'outputType',
    description: "This is a user output type",
    fields: {
        id: {type: GraphQLID},
        fullname: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        password: {type: GraphQLString},
        displaPicture: {type: GraphQLString},
        businessId: {type: GraphQLString},
        requestStatus: {type: GraphQLString},
        requestMessage: {type: GraphQLString}
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
            type: outputType,
            args: {
                fullname: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve (parent, args) {
                let createUser = new CreateUser(UserModel, args);
                return createUser.validateUserInput();

            }
        }
    }
})

module.exports = new GraphQLSchema({ query: userQuery, mutation: userMutation })