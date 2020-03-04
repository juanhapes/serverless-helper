'use strict';

module.exports = ({ functions, ...serviceConfig }, {
	functionName,
	handler,
	description,
	timeout,
	events,
	package: pkg
}) => {

	const functionConfiguration = {
		handler
	};

	if(description)
		functionConfiguration.description = description;

	if(events && Array.isArray(events))
		functionConfiguration.events = events;

	if(timeout)
		functionConfiguration.timeout = timeout;

	if(pkg && pkg.include)
		functionConfiguration.package = { include: pkg.include };

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
