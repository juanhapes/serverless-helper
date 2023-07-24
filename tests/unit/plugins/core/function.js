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
				package: { include: ['path/to/include/file.js'] },
				url: true
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
						package: { include: ['path/to/include/file.js'] },
						url: true
					}
				}]
			});
		});

		it('Should add raw properties to function configuration it they were set', () => {

			const lambdaFunctionResult = lambdaFunction({}, {
				functionName: 'MyFunction',
				handler: 'path/to/handler.export',
				rawProperties: {
					maximumRetryAttempts: 1
				}
			});

			assert.deepStrictEqual(lambdaFunctionResult, {
				functions: [{
					MyFunction: {
						maximumRetryAttempts: 1,
						handler: 'path/to/handler.export'
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

		it('Should override function layers if layers is passed', () => {

			const lambdaFunctionResult = lambdaFunction({
				provider: {
					layers: ['DefaultLayer']
				}
			}, {
				functionName: 'MyFunction',
				handler: 'path/to/handler.export',
				layers: ['SomeCustomLayer']
			});

			assert.deepStrictEqual(lambdaFunctionResult, {
				provider: {
					layers: ['DefaultLayer']
				},
				functions: [{
					MyFunction: {
						layers: ['SomeCustomLayer'],
						handler: 'path/to/handler.export'
					}
				}]
			});
		});

		it('Should append function layers if addLayers is passed', () => {

			const lambdaFunctionResult = lambdaFunction({
				provider: {
					layers: ['DefaultLayer']
				}
			}, {
				functionName: 'MyFunction',
				handler: 'path/to/handler.export',
				addLayers: ['SomeCustomLayer']
			});

			assert.deepStrictEqual(lambdaFunctionResult, {
				provider: {
					layers: ['DefaultLayer']
				},
				functions: [{
					MyFunction: {
						layers: ['DefaultLayer', 'SomeCustomLayer'],
						handler: 'path/to/handler.export'
					}
				}]
			});
		});

		it('Should set function layers if addLayers is passed but no global layers are set', () => {

			const lambdaFunctionResult = lambdaFunction({}, {
				functionName: 'MyFunction',
				handler: 'path/to/handler.export',
				addLayers: ['SomeCustomLayer']
			});

			assert.deepStrictEqual(lambdaFunctionResult, {
				functions: [{
					MyFunction: {
						layers: ['SomeCustomLayer'],
						handler: 'path/to/handler.export'
					}
				}]
			});
		});

		it('Should not set any function layers if neither layers nor addLayers are passed', () => {

			const lambdaFunctionResult = lambdaFunction({
				provider: {
					layers: ['DefaultLayer']
				}
			}, {
				functionName: 'MyFunction',
				handler: 'path/to/handler.export'
			});

			assert.deepStrictEqual(lambdaFunctionResult, {
				provider: {
					layers: ['DefaultLayer']
				},
				functions: [{
					MyFunction: {
						handler: 'path/to/handler.export'
					}
				}]
			});
		});
	});
});
