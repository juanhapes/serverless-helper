'use strict';

const assert = require('assert').strict;

const { envVars } = require('../../.././../lib/plugins/core');

describe('Core plugins', () => {

	describe('Environment variables', () => {

		it('Should throw if no variables are passed', () => {
			assert.throws(() => envVars({}));
		});

		it('Should throw if invalid variables are passed', () => {
			assert.throws(() => envVars({}, 8));
			assert.throws(() => envVars({}, 'invalid'));
			assert.throws(() => envVars({}, ['invalid']));
		});

		it('Should throw if an empty object of variables is passed', () => {
			assert.throws(() => envVars({}, {}));
		});

		it('Should generate the provider object and set the environment vars if provider is not set', () => {
			const result = envVars({}, {
				foo: 'bar'
			});

			assert.deepStrictEqual(result, {
				provider: {
					environment: {
						foo: 'bar'
					}
				}
			});
		});

		it('Should mantain the provider object and set the environment vars if provider is set', () => {
			const result = envVars({
				provider: {
					name: 'aws'
				}
			}, {
				foo: 'bar'
			});

			assert.deepStrictEqual(result, {
				provider: {
					name: 'aws',
					environment: {
						foo: 'bar'
					}
				}
			});
		});

		it('Should add the environment vars to previous ones if they are defined', () => {
			const result = envVars({
				provider: {
					name: 'aws',
					environment: {
						previous: 'var'
					}
				}
			}, {
				foo: 'bar'
			});

			assert.deepStrictEqual(result, {
				provider: {
					name: 'aws',
					environment: {
						previous: 'var',
						foo: 'bar'
					}
				}
			});
		});
	});
});
