const shell = require('shelljs');
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

shell.exec('npm install graphql');
shell.exec('npm install graphql-request');

const date, twoWeeksBeforeDate = new Date();
var twoWeeksBefore = date.getDate() - 14;
twoWeeksBeforeDate.setDate(twoWeeksBefore);

const repository = path.resolve(__dirname, '..').split(path.sep).pop();
const gitChecks = [getAvgPickUpTime({from: date, to: twoWeeksBefore, repository}), getAvgReviewTime({from: date, to: twoWeeksBefore, repository})];
Promise.all(gitChecks).then(res => console.log(util.inspect(res, {depth: null})));
