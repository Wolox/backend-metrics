/* eslint-disable */

const shell = require('shelljs');
const seconds = 1000;
const generalResult = [];
const npmCheck = require('npm-check');

exports.getBuildTime = testPath => {
  shell.exec(`npm i --prefix ${testPath}`);
  const start = new Date();
  shell.exec(`npm run build development --prefix ${testPath}`);
  const buildTime = (new Date().getTime() - start.getTime()) / seconds;
  return [{ metric: 'BUILD TIME', description: 'Build Time', value: buildTime }];
};

exports.getDependencies = async testPath => {
  const installInfo = shell.exec(`npm i --prefix ${testPath}`);
  const totalPackages = installInfo.stdout.slice(
    installInfo.stdout.search('audited') + 'audited'.length,
    installInfo.stdout.search('packages in')
  );
  const currentState = await npmCheck({ cwd: testPath });

  const packages = currentState.get('packages');
  generalResult.push({
    metric: 'DIRECT_DEPENDENCIES',
    description: 'Cantidad de dependencias directas',
    value: packages.length
  });
  generalResult.push({
    metric: 'INDIRECT_DEPENDENCIES',
    description: 'Cantidad de dependencias no directas',
    value: parseInt(totalPackages) - packages.length
  });
  return generalResult;
};
