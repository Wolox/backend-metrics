/* eslint-disable */

const util = require('util');
const path = require('path');
const { request } = require('graphql-request');
const api = 'https://node-github-stats.herokuapp.com/graphql';

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

const date = new Date();
const twoWeeksBefore = new Date(new Date().getTime() - 2*7*24*60*60*1000);

const repository = process.env.CIRCLE_PROJECT_REPONAME;

const gitChecks = [getAvgPickUpTime({from: twoWeeksBefore.toISOString(), to: date.toISOString(), repository}), getAvgReviewTime({from: twoWeeksBefore.toISOString(), to: date.toISOString(), repository})];
Promise.all(gitChecks).then(res => console.log(util.inspect(res, {depth: null})));

