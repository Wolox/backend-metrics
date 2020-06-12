const ElasticApmService = require('../../services/elastic_apm');
const { DEFAULT_ENVIRONMENTS_INFO } = require('./utils/constants');
const { green, red } = require('./utils/colors');
const monitoringTools = require('./utils/monitoring_tools');
const shell = require('shelljs');

const crashesCheck = async (projectName, environmentInfo, monitoringTool) => {
  let arrayOfData
  if (monitoringTool === 'elastic-apm-node') {
    arrayOfData = await Promise.all(
      environmentInfo.environments.map(environment =>
        ElasticApmService.getProjectEnvironmentErrors(projectName, environment)
          .then(response => {
            if (response.data.count === 0) console.log(red, `El ambiente ${environment} del proyecto no tiene errores`);
            return response.data.count;
          })
          .catch(err => {
            console.log(red, `Hubo un error y no se pudo conectar a kibana en el ambiente ${environment}`);
            return 0;
          })
      )
    );
  } else
    environmentInfo.environments.map(env =>
      console.log(red, `No es posible obtener los errores en ambiente ${env} con el paquete de monitoreo encontrado`));

  const sumOfCrashes = !!arrayOfData ? arrayOfData.reduce((acum, value) => acum + value, 0) : undefined;
  return {
    metric: environmentInfo.metricName,
    description: environmentInfo.description,
    environments: environmentInfo.environments,
    value: sumOfCrashes
  };
};

const pkgInstalled = (pkg, projectPath) => {
  const shellRes = shell.exec(`npm ls | grep ${pkg}`, { silent: true, cwd: projectPath });
  return shellRes.stdout !== '' && shellRes.stdout.includes(pkg);
};

module.exports = async (projectName, projectPath) => {
  let monitoringToolInstalled = '';
  monitoringToolInstalled = monitoringTools.find(pkg => pkgInstalled(pkg, projectPath));
  (!!monitoringToolInstalled) ?
    console.log(green, `El paquete npm de monitoreo '${monitoringToolInstalled}' esta instalado`) :
    console.log(red, `No se encontro paquete npm de monitoreo instalado`);
  const crashesMetrics = await Promise.all([
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS_INFO.PRODUCTION, monitoringToolInstalled),
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS_INFO.STAGE, monitoringToolInstalled),
    crashesCheck(projectName, DEFAULT_ENVIRONMENTS_INFO.DEVELOPMENT, monitoringToolInstalled)
  ]);
  console.log(green, 'Chequeos de crashes terminados con exito ✓');
  return crashesMetrics;
};
