'use strict';

const normalizeConfig = require('./config/normalizer');

const loadPlugins = require('./plugins/loader');

const processService = require('./process');

module.exports.helper = (serviceConfig, serviceBase) => {

	const safeConfig = normalizeConfig(serviceConfig);

	const plugins = loadPlugins(safeConfig);

	return processService(plugins, safeConfig, serviceBase || {});
};
