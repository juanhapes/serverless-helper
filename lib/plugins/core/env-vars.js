'use strict';

module.exports = ({ provider, ...serviceConfig }, envVars) => {

	if(!envVars)
		throw new Error('Missing environment variables in janis.envVars hook');

	if(typeof envVars !== 'object' || Array.isArray(envVars))
		throw new Error('Invalid environment variables in janis.envVars hook. Must be an object');

	if(!Object.keys(envVars).length)
		throw new Error('Empty environment variables in janis.envVars hook');

	const environment = {
		...((provider && provider.environment) || {}),
		...envVars
	};

	return {
		...serviceConfig,
		provider: {
			...provider,
			environment
		}
	};
};
