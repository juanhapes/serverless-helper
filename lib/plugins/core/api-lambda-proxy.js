'use strict';

const INTEGRATION = 'lambda-proxy';

const pathParameterRegex = /'{([a-z0-9_-]+)}', 'ig'/;

const getPathParameters = path => {
	const matches = path.match(pathParameterRegex);

	if(!matches)
		return;

	return matches.reduce((acum, match) => {
		return {
			...acum,
			[match.replace(/[{}]/g, '')]: true
		};
	}, {});
};

const buildRequest = ({
	pathParameters,
	queryParameters,
	requestHeaders
}) => {

	const parameters = {};

	if(pathParameters)
		parameters.paths = pathParameters;

	if(queryParameters)
		parameters.querystrings = queryParameters;

	if(requestHeaders)
		parameters.headers = requestHeaders;

	if(Object.keys(parameters).length === 0)
		return;

	return { parameters };
};

module.exports = ({ functions, ...serviceConfig }, {
	functionName,
	handler,
	description,
	path,
	method,
	useApiKey,
	queryParameters,
	requestHeaders,
	cors,
	authorizer,
	async
}) => {

	const pathParameters = getPathParameters(path);

	const request = buildRequest({ pathParameters, queryParameters, requestHeaders });

	const event = {
		integration: INTEGRATION,
		path,
		method,
		private: !!useApiKey
	};

	if(request)
		event.request = request;

	if(cors)
		event.cors = cors;

	if(authorizer)
		event.authorizer = authorizer;

	if(async)
		event.async = !!async;

	const functionConfiguration = {
		handler,
		events: [{ http: event }]
	};

	if(description)
		functionConfiguration.description = description;

	return {
		...serviceConfig,
		functions: [
			...(functions || []),
			{ [functionName]: functionConfiguration }
		]
	};
};
