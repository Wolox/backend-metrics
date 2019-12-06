/* eslint-disable */

const shell = require('shelljs');
shell.config.silent = true;
const FUNCTIONOFFSET = 95;
const LINESOFFSET = 106;
const PERCENTAGEPRECISION = 5;

exports.checkCoverage = (testPath) => {
  console.log('Empezando coverage para el build...');
  const metrics = [];
  const results = shell.exec(
    `npm run cover ${testPath}`
  );
  const allFilesIndex = results.stdout.search('\nAll files');
  const functionPercent = results.stdout.slice(
    allFilesIndex + FUNCTIONOFFSET,
    allFilesIndex + FUNCTIONOFFSET + PERCENTAGEPRECISION
  );
  metrics.push({
    metric: 'Functions Covered',
    description: '% de funciones cubiertas',
    value: parseInt(functionPercent[2] === "." ? functionPercent : functionPercent.slice(0,1))
  });
  const linesPercent = results.stdout.slice(
    allFilesIndex + LINESOFFSET,
    allFilesIndex + LINESOFFSET + PERCENTAGEPRECISION
  );
  metrics.push({
    metric: 'Lines covered',
    description: '% de lineas cubiertas',
    value: parseInt(linesPercent[2] === "." ? linesPercent : linesPercent.slice(0,2))
  });
  return metrics;
};


