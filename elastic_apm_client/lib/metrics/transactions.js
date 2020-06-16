const { getTransactionMetrics } = require('../services/elastic_apm');

const SECONDS_PER_WEEK = 7 * 24 * 60 * 60;

const errorRateFromBuckets = buckets => {
  const totalCount = buckets.reduce((acc, { doc_count }) => acc + doc_count, 0);
  const { doc_count: errorsCount = 0 } = buckets.find(({ key }) => key === 'failure') || {};
  return errorsCount / totalCount;
};

const throughputFromRequests = ({ doc_count }) => doc_count / SECONDS_PER_WEEK;

const metricsFromResponse = response => {
  const requests = response.data && response.data.aggregations && response.data.aggregations.requests;
  if (!requests) throw new Error('Got invalid response from Elastic APM');
  if (requests.doc_count === 0) throw new Error('No transactions were found for this environment in the last week');
  return {
    latencyAverage: requests.latency_average.value / 1000,
    errorRate: errorRateFromBuckets(requests.response_status.buckets),
    throughput: throughputFromRequests(requests)
  };
}

exports.getTransactionMetrics = (projectName, environment = 'production') =>
  getTransactionMetrics(projectName, environment)
    .then(metricsFromResponse)
    .catch(error => {
      console.log(`Error when getting a response from Elastic APM: ${error.message}`);
      throw error;
    });
