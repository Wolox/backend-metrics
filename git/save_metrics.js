/* eslint-disable */
const requestPromise = require('request-promise');

const saveMetrics = body =>
  requestPromise({
    url: 'https://intense-shore-66409.herokuapp.com/metrics',
    method: 'post',
    json: true,
    body,
})
.then(console.log)
.catch(console.log);

const buildMetrics = ({env,repository, metrics}) => ({
    env,
    tech: 'node',
    repo_name: repository,
    metrics,
    project_id: '9',
    project_name: 'svl'
})

module.exports = {saveMetrics, buildMetrics};
