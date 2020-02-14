'use strict';

module.exports = ({ functions, ...serviceConfig }, {
	functionName,
	handler,
	description,
	timeout
}) => {

	const functionConfiguration = {
		handler
	};

	if(description)
		functionConfiguration.description = description;

	if(timeout)
		functionConfiguration.timeout = timeout;

	return {
		...serviceConfig,
		functions: [
			...(functions || []),
			{
				[functionName]: functionConfiguration
			}
		]
	};
};
