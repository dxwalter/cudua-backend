"use-strict";
const graphql = require("graphql");
const  { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const UserSchema = require("./UserSchema");

module.exports = new GraphQLSchema({ query: UserSchema });