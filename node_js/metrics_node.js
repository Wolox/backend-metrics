const { getBuildTime, getDependencies } = require('./general_checks.js');
const { checkInspect } = require('./quality.js');
const { checkCoverage } = require('./coverage.js');

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
  return result;
};

runAllChecks('').then(res => console.log(res));
