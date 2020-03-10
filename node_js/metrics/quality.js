/* eslint-disable */

const shell = require('shelljs');
shell.config.silent = true;
const results = [];

const getMatches = (instances, testPath) => {
  const inspectResult = shell.exec(
    `./node_modules/.bin/jsinspect -I -L -m ${instances} -t 20 --ignore "migrations|test|coverage" ${testPath}`
  );
  const auxString = inspectResult.stdout.slice(0, inspectResult.lastIndexOf('matches'));
  const matches = auxString.slice(auxString.lastIndexOf('\n'));
  console.log(auxString,matches);
  return parseInt(matches);
};

const getMatchesWithXInstances = (instances, testPath) =>
  getMatches(instances, testPath) - getMatches(instances + 1, testPath);

exports.checkInspect = async testPath => {
  let score = 100;
  let instances = 2;
  let matches = -1;
  while (matches !== 0 && instances <= 11) {
    matches = await getMatchesWithXInstances(instances, testPath);
    console.log(score, matches, instances)
    // eslint-disable-next-line
    score = score - matches * (instances / 4);
    instances++;
  }
  results.push({
    metric: 'CODE QUALITY',
    description: 'Puntaje basado en cantidad de codigo duplicado',
    value: score || 'No jest found'
  });
  return results;
};

