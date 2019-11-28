/* eslint-disable */
const { request } = require('graphql-request');
const { GraphQLString } = require('graphql');
const { gitStatsByTech } = require('./types');
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
