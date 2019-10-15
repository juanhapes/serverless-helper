'use strict';

const INTEGRATION = 'lambda-proxy';

const pathParameterRegex = new RegExp('{([a-z0-9_-]+)}', 'ig');

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

	const request = {};

	if(pathParameters)
		request.paths = pathParameters;

	if(queryParameters)
		request.querystrings = queryParameters;

	if(requestHeaders)
		request.headers = requestHeaders;

	if(Object.keys(request).length === 0)
		return;

	return request;
};

module.exports = ({
	functionName,
	handler,
	description,
	path,
	method,
	useApiKey,
	queryParameters,
	requestHeaders
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

	const functionConfiguration = {
		handler,
		events: [{ http: event }]
	};

	if(description)
		functionConfiguration.description = description;

	return { [functionName]: functionConfiguration };
};
