'use strict';

const assert = require('assert').strict;

const mockRequire = require('mock-require');

const { loadPlugins, loadCorePlugins } = require('../../../lib/plugins/loaders');

describe('Plugin loaders', () => {

	describe('Core plugins loader', () => {

		it('Should return an object with the core plugins', () => {

			const corePlugins = loadCorePlugins();

			assert(typeof corePlugins === 'object' && !Array.isArray(corePlugins));
		});

	});

	describe('Custom plugins loader', () => {

		it('Should throw if a custom plugin is not installed', () => {
			assert.throws(() => loadPlugins([
				'non-existing-plugin'
			]));
		});

		it('Should return an object with the custom plugins', () => {

			const existingPlugin = () => {};
			const anotherPlugin = () => {};

			mockRequire('sls-helper-plugin-existing', existingPlugin);
			mockRequire('sls-helper-plugin-another-one', anotherPlugin);

			const customPlugins = loadPlugins([
				'existing',
				'another-one'
			]);

			assert.deepStrictEqual(customPlugins, {
				existing: existingPlugin,
				'another-one': anotherPlugin
			});

			mockRequire.stop('sls-helper-plugin-existing');
			mockRequire.stop('sls-helper-plugin-another-one');
		});

	});

});
