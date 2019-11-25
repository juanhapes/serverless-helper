'use strict';

const { inspect } = require('util');

/**
 * Normalizes a hook name with prefix
 *
 * @param {String} hookName The hook name with or without plugin name prefix
 * @return {String} The hook prefixed with plugin name (default 'core')
 */
const normalizeHookName = hookName => (hookName.includes('.') ? hookName : `core.${hookName}`);

/**
 * Normalizes a hooks as an array with the hook name prefixed with plugin name (default core)
 *
 * @param {Array|String} hook The hook name or full form (array of [name, params])
 * @return {Array} The full hook form with prefixed name
 */
const normalizeHook = hook => {

	if(typeof hook === 'string')
		hook = [hook];

	if(Array.isArray(hook)) {
		const [hookName, hookParams] = hook;

		if(typeof hookName !== 'string')
			throw new Error(`Invalid hook name: ${inspect(hookName)}`);

		return [normalizeHookName(hookName), hookParams];
	}

	throw new Error(`Invalid hook: ${inspect(hook)}`);
};

/**
 * Normalizes the config in order to avoid format checks afterwards
 *
 * @param {Object} serviceConfig The service configuration
 */
module.exports = serviceConfig => {

	if(typeof serviceConfig.hooks !== 'undefined' && !Array.isArray(serviceConfig.hooks))
		throw new Error(`Invalid hooks property: ${inspect(serviceConfig.hooks)}`);

	return {
		hooks: (serviceConfig.hooks && serviceConfig.hooks.map(normalizeHook)) || []
	};
};
