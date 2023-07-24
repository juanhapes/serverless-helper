'use strict';

const parseFunctionLayers = (layers, addLayers, serviceConfig) => {

	if(layers)
		return { layers };

	if(addLayers?.length) {
		return {
			layers: [
				...serviceConfig?.provider?.layers || [],
				...addLayers
			]
		};
	}
};

module.exports = ({ functions, ...serviceConfig }, {
	functionName,
	handler,
	description,
	timeout,
	memorySize,
	events,
	layers,
	addLayers,
	package: pkg,
	reservedConcurrency,
	url,
	rawProperties
}) => {

	const functionConfiguration = {
		...parseFunctionLayers(layers, addLayers, serviceConfig),
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
