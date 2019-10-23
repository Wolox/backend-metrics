const { gql } = require('apollo-server');

const rootTypes = gql`
  extend type Query {}
  extend type Mutation {}
  extend type Subscription {}
`;

exports.typeDefs = [rootTypes];
