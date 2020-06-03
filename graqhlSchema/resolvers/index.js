const { mergeResolvers } = require('@graphql-tools/merge');
const BusinessResolver = require('./BusinessResolver');
const UserResolver = require('./UserResolver');

const resolvers = [
  UserResolver,
  BusinessResolver,
];

module.exports = mergeResolvers(resolvers);