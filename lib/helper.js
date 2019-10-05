'use strict';

const { loadPlugins, loadCorePlugins } = require('./plugins/loaders');

module.exports.helper = plugins => ({
	...loadCorePlugins(),
	...loadPlugins(plugins || [])
});
