const { mergeResolvers } = require('@graphql-tools/merge');
const BusinessResolver = require('./BusinessResolver');
const UserResolver = require('./UserResolver');
const CategoryResolver = require('./CategoryResolver'); 
const SubcategoryResolver = require('./SubcategoryResolver'); 
const BusinessCategoryResolver = require('./BusinessCategoryResolver');

const resolvers = [
  UserResolver,
  BusinessResolver,
  CategoryResolver,
  SubcategoryResolver,
  BusinessCategoryResolver
];

module.exports = mergeResolvers(resolvers);