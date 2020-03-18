'use strict';

const apiLambdaProxy = require('./api-lambda-proxy');
const bucket = require('./bucket');
const lambdaFunction = require('./function');
const iamStatement = require('./iam-statement');
const envVars = require('./env-vars');
const resource = require('./resource');

module.exports = {
	bucket,
	apiLambdaProxy,
	function: lambdaFunction,
	iamStatement,
	envVars,
	resource
};
