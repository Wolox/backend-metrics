const { request } = require('graphql-request');
const { GraphQLString } = require('graphql');
const { gitStatsByTech } = require('./types');
const api = 'https://node-github-stats.herokuapp.com/graphql';

const getAvgPickUpTime = async (hasArgs, args) => {
  let query = 'query{stats {\
    pr_pick_up_time_avg {\
      tech_name\
      value\
    }\
  }}';
  if (args) {
    query =
      'stats {\
      pr_pick_up_time_avg(from: $from, repository: $repository\
        tech: $tech, to: $to, username: $usernam, merged: $merge ) {\
        tech_name\
        value\
      }\
    }';
  }
  const res = await request(api, query, args);
  return res;
};

const getAvgReviewTime = async args => {
  let query = 'query{stats {\
    merged_prs_without_review {\
      tech_name\
      value\
    }\
  }}';
  if (args) {
    query =
      'stats {\
      pr_pick_up_time_avg(from: $from, repository: $repository\
        tech: $tech, to: $to, username: $usernam, merged: $merge ) {\
        tech_name\
        value\
      }\
    }';
  }
  const res = await request(api, query, args);
  return res;
};

exports.prPickUpTimeAvg = {
  description: 'Pull request average pick up time',
  type: gitStatsByTech,
  args: {
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    repository: { type: GraphQLString },
    tech: { type: GraphQLString },
    username: { type: GraphQLString },
    merge: { type: GraphQLString }
  },
  resolve: getAvgPickUpTime
};

getAvgPickUpTime(false, { from: '', repository: '', tech: '', to: '', username: '', merged: '' })
  .then(res => console.log(res))
  .catch(() => console.log('Error de parte del server'));
getAvgReviewTime()
  .then(res => console.log(res))
  .catch(() => console.log('Error de parte del server'));
