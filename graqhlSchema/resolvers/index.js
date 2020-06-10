const { mergeResolvers } = require('@graphql-tools/merge');
const BusinessResolver = require('./BusinessResolver');
const UserResolver = require('./UserResolver');
const CategoryResolver = require('./CategoryResolver');

const resolvers = [
  UserResolver,
  BusinessResolver,
  CategoryResolver
];

module.exports = mergeResolvers(resolvers);