const apmServer = require('./apm_auth');

module.exports = {
  getProjectEnvironmentErrors: (projectName, environment) => {
    const body = {
      query: {
        bool: {
          must: [
            {
              match: {
                'service.name': projectName
              }
            },
            {
              match: {
                'service.environment': environment
              }
            },
            {
              range: {
                '@timestamp': {
                  gte: 'now-1M/d'
                }
              }
            }
          ]
        }
      }
    };
    const url = `/*-error-*/_count`;
    return apmServer.post(url, body);
  }
};
