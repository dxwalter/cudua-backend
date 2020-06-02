"use-strict";
import graphqlTools  from 'graphql-tools';
const { makeExecutableSchema } = graphqlTools;
import lodash  from 'lodash';
const merge = lodash

import {typeDefs as UserSchema , resolvers as UserSchemaResolver} from './UserSchema.mjs';
// import {typeDefs as BusinessSchema , resolvers as BusinessSchemaResolver} from './BusinessAcountSchema.mjs';

const Query = `
  type Query {
    author(id: Int!): Post
    book(id: Int!): Post
  }
`;

const resolvers = {
    Query: { 
      
    }
  };

console.log(Query)

export const schemaFiles = makeExecutableSchema({
    typeDefs: [UserSchema],
    resolvers: merge(UserSchemaResolver),
});