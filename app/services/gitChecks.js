const request = require('request-promise');

// eslint-disable-next-line no-unused-vars
module.exports = ({ user, from, to, repository, tech }) => ({
  getAvgPickUpTime() {
    const uri = 'https://node-github-stats.herokuapp.com/graphql';
    return request({
      uri,
      qs: { user, from, to, repository, tech }
    });
  }
});
