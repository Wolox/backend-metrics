/* eslint-disable */
const requestPromise = require('request-promise');

const saveMetrics = (body, url) =>
  requestPromise({
    url,
    method: 'post',
    json: true,
    body,
})
.then(console.log)
.catch(console.log);

const buildMetrics = ({env,repository, metrics, tech, projectName}) => ({
    env,
    tech,
    repo_name: repository,
    metrics,
    project_name: projectName
})

module.exports = {saveMetrics, buildMetrics};
