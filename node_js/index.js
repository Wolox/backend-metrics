/* eslint-disable */
const { resolve: resolvePath } = require('path');
const parseArgs = require('minimist');
const { buildClient } = require('elastic-apm-client')

const { getBuildTime, getDependencies } = require('./metrics/general_checks.js');
const { checkInspect } = require('./metrics/quality.js');
const { checkCoverage } = require('./metrics/coverage_jest.js');
const { buildMetrics, saveMetrics } = require('./utils/save_metrics');
const { pkgInstalled } = require('./utils/packages');

const BUILD_TIME = 'build-time';
const DIRECT_DEPENDENCIES = 'direct-dependencies';
const INDIRECT_DEPENDENCIES = 'indirect-dependencies';
const CODE_COVERAGE = 'code-coverage';
const CODE_QUALITY = 'code-quality';

const NODE_METRICS_URL = 'https://backendmetrics.engineering.wolox.com.ar/metrics';
const NODE_TECH = 'node_js';
const ENV_BRANCH = 'development';
// const repository = process.env.CIRCLE_PROJECT_REPONAME || 'YOUR_REPOSITORY';
// const branch = process.env.CIRCLE_BRANCH || 'YOUR_BRANCH';

const getArgs = () => {
  const args = parseArgs(process.argv);
  const repository = args.repository || args.r || '';
  return {
    repository,
    projectPath: args.d || resolvePath('..', '..', repository),
    tech: args.tech || args.t || NODE_TECH,
    projectName: args.projectName || args.p || '',
    branch: args.branch || args.b || ENV_BRANCH,
    metricsUrl: args.metricsUrl || args.m || NODE_METRICS_URL,
    elasticApmProject: args['elastic-apm-project'] || args.e || repository
  };
};

const tryGetElasticMetrics = async (elasticApmProject, projectPath) => {
  if (!pkgInstalled('elastic-apm', projectPath)) return [];
  
  const elasticClient = buildClient(elasticApmProject);
  try {
    return await elasticClient.getMetrics();
  } catch (e) {
    console.log(`Can not get metrics from Elastic APM. Error: ${e.message}`);
    return [];
  }
}

const runAllChecks = async () => {
  const {
    repository,
    tech,
    projectName,
    metricsUrl,
    elasticApmProject,
    projectPath,
    branch: env
  } = getArgs();

  console.log('Checking build time');
  const buildTime = await getBuildTime(projectPath);
  console.log('Checking dependencies');
  const dependencies = await getDependencies(projectPath);
  console.log('Evaluating code codeQuality');
  const codeQuality = await checkInspect(projectPath);
  console.log('Checking coverage');
  const codeCoverage = await checkCoverage(projectPath);
  console.log('Getting Elastic APM Metrics');
  const elasticMetrics = await tryGetElasticMetrics(elasticApmProject, projectPath);

  const metrics = [
    {
      name: BUILD_TIME,
      value: parseFloat(buildTime[0].value),
      version: '1.0'
    },
    {
      name: DIRECT_DEPENDENCIES,
      value: parseFloat(dependencies[0].value),
      version: '1.0'
    },
    {
      name: INDIRECT_DEPENDENCIES,
      value: parseFloat(dependencies[1].value),
      version: '1.0'
    },
    {
      name: CODE_COVERAGE,
      value: parseFloat(codeCoverage[1].value),
      version: '1.0'
    },
    {
      name: CODE_QUALITY,
      value: parseFloat(codeQuality[0].value),
      version: '1.0'
    },
    ...elasticMetrics
  ];
  console.log(metrics);

  return saveMetrics(
    buildMetrics({ metrics, repository, tech, projectName, env }), metricsUrl);
};

runAllChecks()
  .catch(error => {
    console.error(`Error when running checks: ${error}`);
    process.exit(1);
  });
