/* eslint-disable */

const shell = require('shelljs');
shell.config.silent = true;
const FUNCTIONOFFSET = 95;
const LINESOFFSET = 106;
const PERCENTAGEPRECISION = 5;

exports.checkCoverage = async (testPath) => {
  console.log('Empezando coverage para el build...');
  const metrics = [];
  await shell.exec(
    `npm run test -- --coverage ${testPath}`
  );
  const metricsFile = require(`${testPath}/coverage/coverage-summary.json`);
  console.log(metricsFile);
  const functionPercent = metricsFile.total.functions.pct;
  metrics.push({
    metric: 'Functions Covered',
    description: '% de funciones cubiertas',
    value: parseFloat(functionPercent)
  });
  const linesPercent = metricsFile.total.lines.pct;
  metrics.push({
    metric: 'Lines covered',
    description: '% de lineas cubiertas',
    value: parseFloat(linesPercent)
  });
  console.log(functionPercent, linesPercent);
  return metrics;
};


