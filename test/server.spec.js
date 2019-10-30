const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server');
const schema = require('../app/graphql');

const { query: _query, mutate } = createTestClient(new ApolloServer({ schema }));

const query = params => _query({ query: params });

module.exports = { query, mutate };
