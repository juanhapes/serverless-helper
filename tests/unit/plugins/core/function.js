'use strict';

const assert = require('assert').strict;

const { function: lambdaFunction } = require('../../../../lib/plugins/core');

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
				timeout: 6,
				memorySize: 2048,
				reservedConcurrency: 1,
				events: [
					{
						schedule: 'rate(1 hour)'
					},
					{
						s3: {
							bucket: 'myBucket',
							event: 's3:ObjectCreated:*'
						}
					}
				],
				package: { include: ['path/to/include/file.js'] }
			});

			assert.deepStrictEqual(lambdaFunctionResult, {
				functions: [{
					MyFunction: {
						handler: 'path/to/handler.export',
						description: 'My super description',
						timeout: 6,
						memorySize: 2048,
						reservedConcurrency: 1,
						events: [
							{
								schedule: 'rate(1 hour)'
							},
							{
								s3: {
									bucket: 'myBucket',
									event: 's3:ObjectCreated:*'
								}
							}
						],
						package: { include: ['path/to/include/file.js'] }
					}
				}]
			});
		});

		it('Should throw when a function events property isn\'t an array', () => {

			assert.throws(() => lambdaFunction({}, {
				functionName: 'MyFunction',
				handler: 'path/to/handler.export',
				description: 'My super description',
				timeout: 6,
				events: { not: 'an array' },
				package: { include: ['path/to/include/file.js'] }
			}));
		});
	});
});
