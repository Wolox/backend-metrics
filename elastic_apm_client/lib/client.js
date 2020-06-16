const { getCrashesMetrics } = require('./metrics/crashes');
const { getTransactionMetrics } = require('./metrics/transactions');
const { formatCrashesMetrics, formatTransactionMetrics } = require('./mappers');

class ElasticAPMClientError extends Error {
  constructor(message) {
    this.message = message;
  }
}

class ElasticAPMClient {
  constructor(projectName) {
    this.projectName = projectName;
  }
  async getMetrics() {
    return Promise.all(
      getCrashesMetrics(this.projectName),
      getTransactionMetrics(this.projectName)
    ).then(([errorsResponse, transactionsResponse]) => [
      ...formatCrashesMetrics(errorsResponse),
      ...formatTransactionMetrics(transactionsResponse)
    ]
    ).catch(e => Promise.reject(new ElasticAPMClientError(e)));
  }
}

const buildClient = projectName => new ElasticAPMClient(projectName);

module.exports = { ElasticAPMClient, ElasticAPMClientError, buildClient };
