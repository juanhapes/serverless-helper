'use strict';

const assert = require('assert').strict;

const { function: lambdaFunction } = require('../../.././../lib/plugins/core');

describe('Core plugins', () => {

	describe('Lambda Function', () => {

		it('Should return an object with the basic Lambda Function configuration', () => {

			const lambdaFunctionResult = lambdaFunction({}, {
				functionName: 'MyFunction',
				handler: 'path/to/handler.export'
			});

			assert.deepStrictEqual(lambdaFunctionResult, {
				functions: [{
					MyFunction: {
						handler: 'path/to/handler.export'
					}
				}]
			});
		});

		it('Should return an object with the full Lambda Function configuration', () => {

			const lambdaFunctionResult = lambdaFunction({}, {
				functionName: 'MyFunction',
				handler: 'path/to/handler.export',
				description: 'My super description',
				schedule: 'rate(1 hour)',
				timeout: 6,
				package: { include: ['path/to/includ/file.js'] }
			});

			assert.deepStrictEqual(lambdaFunctionResult, {
				functions: [{
					MyFunction: {
						handler: 'path/to/handler.export',
						description: 'My super description',
						schedule: 'rate(1 hour)',
						timeout: 6,
						package: { include: ['path/to/includ/file.js'] }
					}
				}]
			});
		});
	});
});
