/* eslint-disable */

const shell = require('shelljs');
shell.config.silent = true;
const FUNCTIONOFFSET = 83;
const LINESOFFSET = 94;
const PERCENTAGEPRECISION = 5;

exports.checkCoverage = testPath => {
  console.log('Starting coverage for the build...');
  const metrics = [];
  const results = shell.exec(
    `npm run coverage`
  );
  const allFilesIndex = results.stdout.search('\nAll files');
  const functionPercent = results.stdout.slice(
    allFilesIndex + FUNCTIONOFFSET,
    allFilesIndex + FUNCTIONOFFSET + PERCENTAGEPRECISION
  );
  metrics.push({
    metric: 'Functions Covered',
    description: '% de funciones cubiertas',
    value: functionPercent
  });
  const linesPercent = results.stdout.slice(
    allFilesIndex + LINESOFFSET,
    allFilesIndex + LINESOFFSET + PERCENTAGEPRECISION
  );
  metrics.push({
    metric: 'Lines covered',
    description: '% de lineas cubiertas',
    value: linesPercent
  });
  return metrics;
};