'use strict';

module.exports = ({ functions, ...serviceConfig }, {
	functionName,
	handler,
	description,
	timeout,
	...options
}) => {

	const functionConfiguration = {
		handler
	};

	if(description)
		functionConfiguration.description = description;

	if(timeout)
		functionConfiguration.timeout = timeout;

	if(options.package && options.package.include)
		functionConfiguration.package = { include: options.package.include };

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
