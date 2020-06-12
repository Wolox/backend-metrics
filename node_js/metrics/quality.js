/* eslint-disable */

const spawn = require('cross-spawn');
const results = [];

exports.checkInspect = testPath => new Promise((resolve, reject) => {
  let score = 100;
  let instances = 5;
  const proc = spawn.sync('./node_modules/.bin/jsinspect', ['-I', '-L', '-m', instances, '-t', '20', '--ignore', "migrations|test|coverage", '--reporter', 'json'], { cwd: testPath });
  if (proc.error) return reject(proc.error);
  const matches = JSON.parse(proc.stdout.toString()).map(i => parseFloat(i.instances.length / 10)).reduce((prev, next) => prev + next, 0);
  score = score - matches * (instances / 4);
  instances++;
  results.push({
    metric: 'CODE QUALITY',
    description: 'Puntaje basado en cantidad de codigo duplicado',
    value: score || 'No jest found'
  });
  return resolve(results);
});
