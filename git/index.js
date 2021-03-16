/* eslint-disable */
require('dotenv').config();
const parseArgs = require('minimist');
const runGitChecks = require('@wolox/git-metrics');

const {buildMetrics, saveMetrics} = require('./save_metrics');

let branch = 'development';
let repository = '';
let tech = 'node';
let projectName = '';
let metricsUrl = '';
let apiKey = '';
let organization = 'wolox';
let gitProvider = 'github';

const args = parseArgs(process.argv);

if (args.branch || args.b) {
  branch = args.branch || args.b;
}

if (args.repository || args.r) {
  repository = args.repository || args.r;
}

if (args.tech || args.t) {
  tech = args.tech || args.t;
}

if (args.projectName || args.p) {
  projectName = args.projectName || args.p;
}

if (args.metricsUrl || args.m) {
  metricsUrl = args.metricsUrl || args.m;
}

if (args.key || args.k) {
  apiKey = args.key || args.k;
}

if (args.organization || args.o) {
  organization = args.organization || args.o;
}

if (args.gitProvider || args.g) {
  gitProvider = args.gitProvider || args.g;
}

runGitChecks(gitProvider, process.env.OAUTH_TOKEN)(repository, organization).then(metrics => {
  const validMetrics = metrics.filter((metric) => !!metric.value);
  const builtMetrics = buildMetrics({ metrics: validMetrics, repository, env: branch, tech, projectName })
  console.log('Saving the following metrics:', builtMetrics);
  return saveMetrics(builtMetrics, metricsUrl, apiKey);
});
