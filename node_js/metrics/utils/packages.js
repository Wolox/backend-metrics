const shell = require('shelljs');

exports.pkgInstalled = (pkg, projectPath) => {
  const shellRes = shell.exec(`npm ls | grep ${pkg}`, { silent: true, cwd: projectPath });
  return shellRes.stdout !== '' && shellRes.stdout.includes(pkg);
};
