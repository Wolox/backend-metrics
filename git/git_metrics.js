const shell = require('shelljs');
const util = require('util')
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
const gitChecks = [getAvgPickUpTime({from: "10/11/2019", to: "24/11/2019", repository: "svl-finance-node"}), getAvgReviewTime({from: "10/11/2019", to: "24/11/2019", repository: "svl-finance-node"})];
Promise.all(gitChecks).then(res => console.log(util.inspect(res, {depth: null})));
