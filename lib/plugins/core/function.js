'use strict';

module.exports = ({ functions, ...serviceConfig }, {
	functionName,
	handler,
	description,
	schedule,
	timeout,
	package: pkg
}) => {

	const functionConfiguration = {
		handler
	};

	if(description)
		functionConfiguration.description = description;

	if(schedule)
		functionConfiguration.schedule = schedule;

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
