'use strict';

const { inspect } = require('util');

const logger = require('lllog')();

module.exports = async (plugins, { hooks }, serviceBase) => {

	logger.debug('Starting to process hooks');

	let serviceConfig = serviceBase;

	for(const [hookName, hookParams] of hooks) {

		logger.debug(`Processing hook ${hookName} with params ${inspect(hookParams)}`);

		const [plugin, method] = hookName.split('.');

		if(!plugins[plugin][method] || typeof plugins[plugin][method] !== 'function')
			throw new Error(`Hook ${method} not found in ${plugin}. Check the documentation again.`);

		serviceConfig = await plugins[plugin][method](serviceConfig, hookParams);

	}

	return serviceConfig;
};
