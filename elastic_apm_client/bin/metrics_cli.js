#!/usr/bin/env node

const { program } = require('commander');
const { writeFileSync } = require('fs');

const { buildClient } = require('../lib/client');

program
  .requiredOption('-e --elastic-apm-project <name>', 'Project name on Elastic APM')
  .option('-o --output <file>', 'Output file', process.stdout.fd)
  .parse(process.argv);

const { elasticApmProject, output } = program;

if (output === process.stdout.fd) {
  console.log = console.error
};
const writeOutput = data => writeFileSync(output, data);

const elasticApmClient = buildClient(elasticApmProject);

elasticApmClient
  .getMetrics()
  .then(metrics => writeOutput(JSON.stringify(metrics)))
  .catch(e => {
    console.error('Got an error when trying to fetch metrics: ', e);
    process.exit(1);
  })

