/* eslint-disable */
const requestPromise = require('request-promise');

const saveMetrics = (body, url, apiKey) =>
  requestPromise({
    url,
    method: 'post',
    json: true,
    body,
    headers: {
      Authorization: apiKey
    }
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
