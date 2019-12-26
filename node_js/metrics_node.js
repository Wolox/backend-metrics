/* eslint-disable */

const { getBuildTime, getDependencies } = require('./general_checks.js');
const { checkInspect } = require('./quality.js');
const { checkCoverage } = require('./coverage_nyc.js');
const {buildMetrics, saveMetrics} = require('../git/save_metrics');

const BUILD_TIME = 'build-time';
const DIRECT_DEPENDENCIES = 'direct-dependencies';
const INDIRECT_DEPENDENCIES = 'indirect-dependencies';
const CODE_COVERAGE = 'code-coverage';
const CODE_QUALITY = 'code-quality';
const repository = process.env.CIRCLE_PROJECT_REPONAME || 'YOUR_REPOSITORY';
const branch = process.env.CIRCLE_BRANCH || 'YOUR_BRANCH';

const runAllChecks = async testPath => {
  const result = [];
  console.log('Checking build time');
  const buildTime = await getBuildTime(testPath);
  console.log('Checking dependencies');
  const dependencies = await getDependencies(testPath);
  console.log('Evaluating code codeQuality');
  const codeQuality = await checkInspect(testPath);
  console.log('Checking coverage');
  const codeCoverage = await checkCoverage(testPath);
  result.push(buildTime);
  result.push(dependencies);
  result.push(codeQuality);
  result.push(codeCoverage);
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
    buildMetrics({metrics, repository, env: branch}));
};

runAllChecks('').then(res => console.log(res));

