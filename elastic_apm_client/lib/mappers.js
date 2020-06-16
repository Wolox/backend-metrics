const {
  PRODUCTION_CRASHES,
  STAGE_CRASHES,
  LATENCY_AVERAGE,
  ERROR_RATE,
  THROUGHPUT
} = require('./metrics_names');

exports.formatTransactionMetrics = transactions => transactions ? [
  {
    name: LATENCY_AVERAGE,
    value: transactions.latencyAverage,
    version: '1.0'
  },
  {
    name: ERROR_RATE,
    value: transactions.errorRate,
    version: '1.0'
  },
  {
    name: THROUGHPUT,
    value: transactions.throughput,
    version: '1.0'
  }
] : [];

// TODO: standardize names used on this package
const metricsMapping = {
  PRODUCTION_CRASHES: PRODUCTION_CRASHES,
  STAGE_CRASHES: STAGE_CRASHES
};

exports.formatCrashesMetrics = crashesMetrics =>
  crashesMetrics
    .filter(({ metric }) => metric in metricsMapping)
    .map(({ metric, value }) => ({ name: metricsMapping[metric], value, version: '1.0' }));
