'use strict';

const logger = require('lllog')();

const corePlugins = require('./core');

module.exports.loadPlugins = plugins => {

	return plugins.reduce((acum, pluginName) => {

		try {
			const plugin = require(`sls-helper-plugin-${pluginName}`); // eslint-disable-line

			return {
				...acum,
				[pluginName]: plugin
			};
		} catch(e) {

			logger.info(`Error loading plugin ${pluginName}`);
			logger.info(`Make sure to install it running \`npm i -D sls-helper-plugin-${pluginName}\``);

			throw new Error(`Error loading plugin ${pluginName}: ${e.message}`);
		}

	}, {});
};

module.exports.loadCorePlugins = () => {
	return corePlugins;
};
