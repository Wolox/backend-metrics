const apmServer = require('./apm_auth');

const projectFilters = (projectName, environment) => [
  {
    match: {
      'service.name': projectName
    }
  },
  {
    match: {
      'service.environment': environment
    }
  }
];

const oneWeekAgo = {
  "@timestamp": {
    gte: "now-1w/d"
  }
};

const oneMonthAgo = {
  '@timestamp': {
    gte: 'now-1M/d'
  }
};

module.exports = {
  getProjectEnvironmentErrors: (projectName, environment) => {
    const body = {
      query: {
        bool: {
          must: [
            ...projectFilters(projectName, environment),
            { range: oneMonthAgo }
          ]
        }
      }
    };
    const url = `/*-error-*/_count`;
    return apmServer.post(url, body);
  },
  getTransactionMetrics: (projectName, environment) =>
    apmServer.post('/apm-*-transaction-*/_search?size=0', {
      aggs: {
        requests: {
          filter: {
            bool: {
              filter: [
                ...projectFilters(projectName, environment),
                { range: oneWeekAgo }
              ]
            }
          },
          aggs: {
            latency_average: {
              avg: {
                field: "transaction.duration.us"
              }
            },
            response_status: {
              terms: {
                script: {
                  source: `
                  int statusCode = (int)doc['http.response.status_code'].value;
                  return statusCode >= 500 ? 'failure' : 'success';`,
                  lang: "painless"
                }
              }
            }
          }
        }
      }
    })
};