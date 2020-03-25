/* eslint-disable */

const util = require('util');
const { request } = require('graphql-request');
const parseArgs = require('minimist');

const api = 'https://node-github-stats.herokuapp.com/graphql';
const {buildMetrics, saveMetrics} = require('./save_metrics');

const PICK_UP_TIME = 'pick-up-time';
const CODE_REVIEW_AVERAGE_TIME = 'code-review-avg-time';

const generateGitStatsArgsString = args => {
  let stringArgs = '';
  Object.keys(args).forEach(key => {
    const auxString = `${key}: "${args[key]}"`;
    if (stringArgs === '') {
      stringArgs = stringArgs.concat(auxString);
    } else {
      stringArgs = stringArgs.concat(', ', auxString);
    }
  });
  return stringArgs;
};

const getAvgPickUpTime = async args => {
  const argsString = generateGitStatsArgsString(args || {});
  const query = `query{stats {\
    pr_pick_up_time_avg(${argsString}) {\
      tech_name\
      value\
    }\
  }}`;
  const res = await request(api, query, args);
  return res;
};

const getAvgReviewTime = async args => {
  const argsString = generateGitStatsArgsString(args || {});
  const query = `query{stats {\
    pr_review_time_avg(${argsString}) {\
      tech_name\
      value\
    }\
  }}`;
  const res = await request(api, query);
  return res;
};

let branch = 'development';
let repository = '';
let tech = 'node';
let projectName = '';
let metricsUrl = '';

const args = parseArgs(process.argv);

if (args.branch || args.b) {
  branch = args.branch || args.b;
}

if (args.repository || args.r) {
  branch = args.repository || args.r;
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

const date = new Date();
const twoWeeksBefore = new Date(new Date().getTime() - 2*7*24*60*60*1000);

const gitChecks = [getAvgPickUpTime({from: twoWeeksBefore.toISOString(), to: date.toISOString(), repository}), getAvgReviewTime({from: twoWeeksBefore.toISOString(), to: date.toISOString(), repository})];
Promise.all(gitChecks).then(res => {
  const pickUpTime = res[0].stats.pr_pick_up_time_avg[0].value;
  const reviewTime = res[1].stats.pr_review_time_avg[0].value;
  const metrics = [
    {
      name: PICK_UP_TIME,
      value: parseFloat(pickUpTime),
      version: '1.0'
    },
    {
      name: CODE_REVIEW_AVERAGE_TIME,
      value: parseFloat(reviewTime),
      version: '1.0'
    },
  ];
  console.log(metrics);
  return saveMetrics(
    buildMetrics({metrics, repository, env: branch, tech, projectName}), metricsUrl)
});


