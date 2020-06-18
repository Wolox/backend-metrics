module.exports = {
  PRODUCTION: {
    metricName: 'PRODUCTION_CRASHES',
    environments: ['production'],
    description: 'Crashes de producción del último mes'
  },
  STAGE: {
    metricName: 'STAGE_CRASHES',
    environments: ['stage'],
    description: 'Crashes de stage del último mes'
  },
  DEVELOPMENT: {
    metricName: 'DEVELOPMENT_CRASHES',
    environments: ['development'],
    description: 'Crashes de development del último mes'
  }
};
