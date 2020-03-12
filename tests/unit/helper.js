'use strict';

const assert = require('assert').strict;

const mockRequire = require('mock-require');

const { helper } = require('../..');

describe('Helper execution', () => {

	describe('Normalizer validation', () => {

		it('Should throw if hooks property is invalid', () => {
			assert.throws(() => helper({ hooks: {} }));
		});

		it('Should throw if a hook configuration is invalid', () => {
			assert.throws(() => helper({ hooks: [{}] }));
		});

		it('Should throw if a hook name is invalid', () => {
			assert.throws(() => helper({
				hooks: [
					[{ invalid: 'hookName' }]
				]
			}));
		});
	});

	describe('Hooks processing', () => {

		before(() => {
			mockRequire('../../lib/plugins/core', {
				someHelper: serviceConfig => ({ ...serviceConfig, someOtherProp: true })
			});

			mockRequire('sls-helper-plugin-custom', {
				someHelper: serviceConfig => ({ ...serviceConfig, someProp: true })
			});
		});

		after(() => {
			mockRequire.stop('sls-helper-plugin-custom');
			mockRequire.stop('../../lib/plugins/core');
		});

		it('Should throw if core hook does not exist', () => {
			assert.throws(() => helper({ hooks: ['unknownHook'] }));
		});

		it('Should throw if plugin hook does not exist', () => {
			assert.throws(() => helper({ hooks: ['custom.unknownHook'] }));
		});

		it('Should return an empty object if no hooks are configured', () => {
			const service = helper({});
			assert.deepStrictEqual(service, {});
		});

		it('Should return the processed object if one unprefixed plugin is configured', () => {
			const service = helper({
				hooks: [
					'someHelper'
				]
			});
			assert.deepStrictEqual(service, {
				someOtherProp: true
			});
		});

		it('Should return the processed object if one core plugin is configured', () => {
			const service = helper({
				hooks: [
					'core.someHelper'
				]
			});
			assert.deepStrictEqual(service, {
				someOtherProp: true
			});
		});

		it('Should return the processed object if one custom plugin is configured', () => {
			const service = helper({
				hooks: [
					'custom.someHelper'
				]
			});
			assert.deepStrictEqual(service, {
				someProp: true
			});
		});

		it('Should throw if one custom plugin is configured but does not exist', () => {
			assert.throws(() => helper({
				hooks: [
					'notFound.someHelper'
				]
			}));
		});

		it('Should return the processed object if two plugins are configured', () => {
			const service = helper({
				hooks: [
					'core.someHelper',
					'custom.someHelper'
				]
			});
			assert.deepStrictEqual(service, {
				someOtherProp: true,
				someProp: true
			});
		});
	});

});
