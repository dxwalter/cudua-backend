const { mergeResolvers } = require('@graphql-tools/merge');
const BusinessResolver = require('./BusinessResolver');
const UserResolver = require('./UserResolver');
const CategoryResolver = require('./CategoryResolver'); 
const SubcategoryResolver = require('./SubcategoryResolver'); 

const resolvers = [
  UserResolver,
  BusinessResolver,
  CategoryResolver,
  SubcategoryResolver
];

module.exports = mergeResolvers(resolvers);