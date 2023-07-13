'use strict';

module.exports = ({ functions, ...serviceConfig }, {
	functionName,
	handler,
	description,
	timeout,
	memorySize,
	events,
	package: pkg,
	reservedConcurrency,
	url,
	rawProperties
}) => {

	const functionConfiguration = {
		...rawProperties,
		...url && { url },
		handler
	};

	if(description)
		functionConfiguration.description = description;

	if(events) {

		if(!Array.isArray(events))
			throw new Error('Invalid events in function hook. Must be an array.');

		functionConfiguration.events = events;
	}

	if(timeout)
		functionConfiguration.timeout = timeout;

	if(memorySize)
		functionConfiguration.memorySize = memorySize;

	if(pkg && pkg.include)
		functionConfiguration.package = { include: pkg.include };

	if(reservedConcurrency)
		functionConfiguration.reservedConcurrency = reservedConcurrency;

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
