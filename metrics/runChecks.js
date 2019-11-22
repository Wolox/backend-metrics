const { getBuildTime, getDependencies } = require('./generalChecks/queries.js');
const { checkInspect } = require('./linterChecks/queries.js');
const { checkCoverage } = require('./metrics/queries.js');

const runAllChecks = async testPath => {
  const result = [];
  const buildTime = await getBuildTime(testPath);
  const dependencies = await getDependencies(testPath);
  const codeQuality = await checkInspect(testPath);
  const codeCoverage = await checkCoverage(testPath);
  result.push(buildTime);
  result.push(dependencies);
  result.push(codeQuality);
  result.push(codeCoverage);
  return result;
};

runAllChecks('/home/amoragues/natura-node').then(res => console.log(res));
