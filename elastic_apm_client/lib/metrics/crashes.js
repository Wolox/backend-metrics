const { getProjectEnvironmentErrors } = require('../../services/elastic_apm');
const environMentsInfo = require('./envirvonments_info');

const crashesCheck = async (projectName, environmentInfo) => {
  arrayOfData = await Promise.all(
    environmentInfo.environments.map(environment =>
      getProjectEnvironmentErrors(projectName, environment)
        .then(response => {
          if (response.data.count === 0) console.log(`El ambiente ${environment} del proyecto no tiene errores`);
          return response.data.count;
        })
        .catch(() => {
          console.log(`Hubo un error y no se pudo conectar a kibana en el ambiente ${environment}`);
          return 0;
        })
    )
  );

  const sumOfCrashes = !!arrayOfData ? arrayOfData.reduce((acum, value) => acum + value, 0) : undefined;
  return {
    metric: environmentInfo.metricName,
    description: environmentInfo.description,
    environments: environmentInfo.environments,
    value: sumOfCrashes
  };
};

exports.getCrashesMetrics = async (projectName) => {
  const crashesMetrics = await Promise.all([
    crashesCheck(projectName, environMentsInfo.PRODUCTION),
    crashesCheck(projectName, environMentsInfo.STAGE),
    crashesCheck(projectName, environMentsInfo.DEVELOPMENT)
  ]);
  console.log(green, 'Chequeos de crashes terminados con exito ✓');
  return crashesMetrics;
};
