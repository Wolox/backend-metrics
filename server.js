const { ApolloServer } = require('apollo-server');
const config = require('./config');
const migrationsManager = require('./migrations');
const logger = require('./app/logger');
const schema = require('./app/graphql');

const port = config.common.api.port || 8080;

migrationsManager
  .check()
  .then(() =>
    /* const rollbar = new Rollbar({
      accessToken: config.common.rollbar.accessToken,
      enabled: !!config.common.rollbar.accessToken,
      environment: config.common.rollbar.environment || config.environment
    }); */
    new ApolloServer({ schema }).listen(port).then(({ url, subscriptionsUrl }) => {
      logger.info(`🚀 Server ready at ${url}`);
      logger.info(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
    })
  )
  .catch(logger.error);
