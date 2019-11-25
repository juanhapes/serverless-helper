'use strict';

const { inspect } = require('util');

const logger = require('lllog')();

module.exports = (plugins, { hooks }, serviceBase) => {

	logger.debug('Starting to process hooks');

	return hooks.reduce((acum, [hookName, hookParams]) => {

		logger.debug(`Processing hook ${hookName} with params ${inspect(hookParams)}`);

		const [plugin, method] = hookName.split('.');

		return plugins[plugin][method](acum, hookParams);

	}, serviceBase);
};
