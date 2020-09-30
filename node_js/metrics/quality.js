const { exec } = require('child_process');
const { promisifyAll } = require('bluebird');
const { readFileAsync, unlinkAsync } = promisifyAll(require('fs'));
const results = [];
const qualityJsonFileName = 'quality.json';

const runInspect = (instances, testPath) => new Promise(resolve => {
  const childProcess = exec(`npx jsinspect -I -L -m ${instances} -t 20 --ignore "migrations|test|coverage|test" --reporter json ${testPath} > ${qualityJsonFileName}`);
  childProcess.stdout.on('close',()=>  resolve());
});

const runInspectAndCollectData = async (instances,testPath) => {
  await runInspect(instances,testPath);
  const data = await readFileAsync(qualityJsonFileName);
  await unlinkAsync(qualityJsonFileName);
  return JSON.parse(data);
}

exports.checkInspect = testPath => new Promise( (resolve, reject) => {
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
    return resolve(results)
  })
});