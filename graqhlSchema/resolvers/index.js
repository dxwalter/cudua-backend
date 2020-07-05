const { mergeResolvers } = require('@graphql-tools/merge');

const BusinessResolver = require('./BusinessResolver');
const UserResolver = require('./UserResolver');
const CategoryResolver = require('./CategoryResolver'); 
const SubcategoryResolver = require('./SubcategoryResolver'); 
const BusinessCategoryResolver = require('./BusinessCategoryResolver');
const ProductResolver = require('./ProductResolver');
const BookmarkResolver = require('./BookmarkResolver');
const ProductReviewResolver = require('./ProductReviewResolver');

const resolvers = [
  UserResolver,
  BusinessResolver,
  CategoryResolver,
  SubcategoryResolver,
  BusinessCategoryResolver,
  ProductResolver,
  BookmarkResolver,
  ProductReviewResolver
];

module.exports = mergeResolvers(resolvers);