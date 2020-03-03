/* eslint-disable */

const parseArgs = require('minimist');

const { getBuildTime, getDependencies } = require('./metrics/general_checks.js');
const { checkInspect } = require('./metrics/quality.js');
const { checkCoverage } = require('./metrics/coverage_nyc.js');
const { buildMetrics, saveMetrics } = require('./utils/save_metrics');

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
  return {
    tech: args.tech || args.t || NODE_TECH,
    branch: args.branch || args.b || ENV_BRANCH,
    repository: args.repository || args.r || '',
    projectName: args.projectName || args.p || '',
    metricsUrl: args.metricsUrl || args.m || NODE_METRICS_URL
  };
};

const runAllChecks = async testPath => {
  const { repository, branch: env, projectName, tech, metricsUrl } = getArgs();

  console.log('Checking build time');
  const buildTime = await getBuildTime(testPath);
  console.log('Checking dependencies');
  const dependencies = await getDependencies(testPath);
  console.log('Evaluating code codeQuality');
  const codeQuality = await checkInspect(testPath);
  console.log('Checking coverage');
  const codeCoverage = await checkCoverage(testPath);

  const metrics = [
    {
      name: BUILD_TIME,
      value: parseFloat(buildTime[0].value).toString(),
      version: '1.0'
    },
    {
      name: DIRECT_DEPENDENCIES,
      value: parseFloat(dependencies[0].value).toString(),
      version: '1.0'
    },
    {
      name: INDIRECT_DEPENDENCIES,
      value: parseFloat(dependencies[1].value).toString(),
      version: '1.0'
    },
    {
      name: CODE_COVERAGE,
      value: parseFloat(codeCoverage[1].value).toString(),
      version: '1.0'
    },
    {
      name: CODE_QUALITY,
      value: parseFloat(codeQuality[0].value).toString(),
      version: '1.0'
    },
  ];
  return saveMetrics(
    buildMetrics({ metrics, repository, env, projectName, tech }), metricsUrl);
};

runAllChecks('');
