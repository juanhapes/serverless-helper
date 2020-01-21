'use strict';

const apiLambdaProxy = require('./api-lambda-proxy');
const bucket = require('./bucket');
const lambdaFunction = require('./function');
const iamStatement = require('./iam-statement');

module.exports = {
	bucket,
	apiLambdaProxy,
	function: lambdaFunction,
	iamStatement
};
