/* eslint-disable */

const spawn = require('cross-spawn');
const results = [];

exports.checkInspect = testPath => new Promise(resolve => {
  let score = 100;
  let instances = 50;
  let matches = -1;
  const proc = spawn('../backend-metrics/node_js/node_modules/.bin/jsinspect', ['-I', '-L', '-m' ,instances, '-t' ,'20', '--ignore' ,"migrations|test|coverage", '--reporter', 'json'],
  { cwd: testPath });
  let output = '';
  proc.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  proc.on('exit', () => {
    console.log('--------------------------------------------------------');
    console.log((output));
    console.log('asd');
    score = score - matches * (instances / 4);
    instances++;
    results.push({
      metric: 'CODE QUALITY',
      description: 'Puntaje basado en cantidad de codigo duplicado',
      value: score || 'No jest found'
    });
    console.log(results)
    return resolve(results);
  });
});
