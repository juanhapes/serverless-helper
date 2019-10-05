'use strict';

const corePlugins = require('./core');

module.exports.loadPlugins = plugins => {

	return plugins.reduce((acum, plugin) => {

		plugin = typeof plugin === 'function' ? { name: plugin.name, handler: plugin } : plugin;

		return {
			...acum,
			[plugin.name]: plugin.handler
		};

	}, {});
};

module.exports.loadCorePlugins = () => {
	return corePlugins;
};
