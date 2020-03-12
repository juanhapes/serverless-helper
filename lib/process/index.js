'use strict';

const { inspect } = require('util');

const logger = require('lllog')();

module.exports = (plugins, { hooks }, serviceBase) => {

	logger.debug('Starting to process hooks');

	return hooks.reduce((acum, [hookName, hookParams]) => {

		logger.debug(`Processing hook ${hookName} with params ${inspect(hookParams)}`);

		const [plugin, method] = hookName.split('.');

		if(!plugins[plugin][method] || typeof plugins[plugin][method] !== 'function')
			throw new Error(`Hook ${method} not found in ${plugin}. Check the documentation again.`);

		return plugins[plugin][method](acum, hookParams);

	}, serviceBase);
};
