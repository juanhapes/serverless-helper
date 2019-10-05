'use strict';

const assert = require('assert').strict;

const { loadPlugins, loadCorePlugins } = require('../../../lib/plugins/loaders');

describe('Plugin loaders', () => {

	describe('Core plugins loader', () => {

		it('Should return an object with the core plugins', () => {

			const corePlugins = loadCorePlugins();

			assert(typeof corePlugins === 'object' && !Array.isArray(corePlugins));
		});

	});

	describe('Custom plugins loader', () => {

		it('Should return an object with the custom plugins', () => {

			const myPlugin = () => {};

			function myOtherPlugin() {}

			const customPlugins = loadPlugins([
				myPlugin,
				myOtherPlugin,
				{ name: 'myCustomPlugin', handler: myPlugin }
			]);

			assert.deepStrictEqual(customPlugins, {
				myPlugin,
				myOtherPlugin,
				myCustomPlugin: myPlugin
			});
		});

	});

});
