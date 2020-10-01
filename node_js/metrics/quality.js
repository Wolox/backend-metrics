const { exec } = require('child_process');
const { promisifyAll } = require('bluebird');
const { readFileAsync, unlinkAsync } = promisifyAll(require('fs'));
const results = [];
const qualityJsonFileName = 'quality.json';

const runInspect = (instances, testPath) => new Promise(resolve => {
  const childProcess = exec(`npx jsinspect -I -L -m ${instances} -t 20 --ignore "migrations|test|coverage|test" --reporter json ${testPath}`);
  let data='';
  childProcess.stdout.on('data',d=>  {
    data += d;
  });
  childProcess.stdout.on('close',()=> {
    resolve(data);
  });
});

const runInspectAndCollectData = (instances,testPath) =>
    runInspect(instances,testPath).then(data => JSON.parse(data));

exports.checkInspect = testPath => {
  let score = 100;
  let instances = 5;
  return runInspectAndCollectData(instances,testPath).then(jsonData => {
    const matches = jsonData.map(i => parseFloat(i.instances.length / 10)).reduce((prev, next) => prev + next, 0);
    score = score - matches * (instances / 4);
    instances++;
    results.push({
      metric: 'CODE QUALITY',
      description: 'Puntaje basado en cantidad de codigo duplicado',
      value: score || 'No jest found'
    });
    return results;
  })
};