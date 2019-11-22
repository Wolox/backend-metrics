const shell = require('shelljs');
shell.config.silent = true;
const FUNCTIONOFFSET = 49;
const LINESOFFSET = 60;
const PERCENTAGEPRECISION = 5;

exports.checkCoverage = testPath => {
  console.log('Empezando coverage para el build...');
  const metrics = [];
  const results = shell.exec(
    // eslint-disable-next-line
    `cd ${testPath}\n NODE_ENV=testing ${testPath}/node_modules/.bin/jest --coverage --detectOpenHandles --forceExit --passWithNoTests ${testPath}`
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
