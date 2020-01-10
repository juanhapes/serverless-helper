'use strict';

const apiLambdaProxy = require('./api-lambda-proxy');
const bucket = require('./bucket');
const lambdaFunction = require('./function');

module.exports = {
	bucket,
	apiLambdaProxy,
	function: lambdaFunction
};
