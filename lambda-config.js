'use strict';

const npmConfig = require('./package.json');

module.exports = {
  region: 'eu-west-1',
  handler: 'index.handler',
  role: 'arn:aws:iam::732726297852:role/lambda_basic_execution',
  functionName: npmConfig.name,
  timeout: 10,
  memorySize: 128,
  runtime: 'nodejs'
}
