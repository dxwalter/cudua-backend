const { mergeResolvers } = require('@graphql-tools/merge');

const BusinessResolver = require('./BusinessResolver');
const UserResolver = require('./UserResolver');
const CategoryResolver = require('./CategoryResolver'); 
const SubcategoryResolver = require('./SubcategoryResolver'); 
const BusinessCategoryResolver = require('./BusinessCategoryResolver');
const ProductResolver = require('./ProductResolver');
const FollowResolver = require('./FollowResolver');
const ProductReviewResolver = require('./ProductReviewResolver');
const MoveLocationResolver = require('./MoveLocationResolver');
const LocationResover = require('./LocationResover');
const CartResolver = require('./CartResolver');
const OrderResolver = require('./OrderResolver');
const CustomerReviewResolver = require('./CustomerReviewResolver');
const NotificationResolver = require('./NotificationResolver');
const SaveForLaterResolver = require('./SaveForLaterResolver');
const AnonymousUserResolver = require('./AnonymousUserResolver');
const MoveCategoriesResolver = require('./MoveCategoriesResolver');
const SubscriptionResolver = require('./SubscriptionResolver');
const CuduaCustomersResolver = require('./CuduaCustomersResolver');
const SearchResolver = require('./SearchResolver');
const HomePageResolver = require('./HomePageResolver');
const AccountingResolver = require('./AccountingResolver');
const EmailSubscribersResolver = require('./EmailSubscribersResolver');
const AdminResolver = require('./administrators/AdminResolver');

const resolvers = [
  UserResolver,
  BusinessResolver,
  CategoryResolver,
  SubcategoryResolver,
  BusinessCategoryResolver,
  ProductResolver,
  FollowResolver,
  ProductReviewResolver,
  MoveLocationResolver,
  LocationResover,
  CartResolver,
  OrderResolver,
  CustomerReviewResolver,
  NotificationResolver,
  SaveForLaterResolver,
  AnonymousUserResolver,
  MoveCategoriesResolver,
  SubscriptionResolver,
  CuduaCustomersResolver,
  SearchResolver,
  HomePageResolver,
  AccountingResolver,
  AdminResolver,
  EmailSubscribersResolver
];

module.exports = mergeResolvers(resolvers);