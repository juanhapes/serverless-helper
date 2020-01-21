'use strict';

const assert = require('assert').strict;

const { iamStatement } = require('../../.././../lib/plugins/core');

describe('Core plugins', () => {

	describe('IAM Statement', () => {

		it('Should throw if an empty effect is passed', () => {
			assert.throws(() => iamStatement({}, {
				effect: '',
				action: 's3:putObject',
				resource: 'my-bucket-resource'
			}));
		});

		it('Should throw if an invalid effect is passed', () => {
			assert.throws(() => iamStatement({}, {
				effect: 'Not valid',
				action: 's3:putObject',
				resource: 'my-bucket-resource'
			}));
		});

		it('Should throw if no action is passed', () => {
			assert.throws(() => iamStatement({}, {
				effect: 'Allow',
				resource: 'my-bucket-resource'
			}));
		});

		it('Should throw if an invalid action is passed', () => {
			assert.throws(() => iamStatement({}, {
				effect: 'Allow',
				action: { foo: 'bar' },
				resource: 'my-bucket-resource'
			}));
		});

		it('Should throw if some valid and some invalid actions are passed', () => {
			assert.throws(() => iamStatement({}, {
				effect: 'Allow',
				action: ['s3:putObject', { foo: 'bar' }],
				resource: 'my-bucket-resource'
			}));
		});

		it('Should throw if no resource is passed', () => {
			assert.throws(() => iamStatement({}, {
				effect: 'Allow',
				action: 's3:putObject'
			}));
		});

		it('Should throw if an invalid resource is passed', () => {
			assert.throws(() => iamStatement({}, {
				effect: 'Allow',
				action: 's3:putObject',
				resource: { foo: 'bar' }
			}));
		});

		it('Should throw if some valid and some invalid resources are passed', () => {
			assert.throws(() => iamStatement({}, {
				effect: 'Allow',
				action: 's3:putObject',
				resource: ['my-bucket-resource', { foo: 'bar' }]
			}));
		});

		it('Should generate a new statement with the default effect', () => {

			const result = iamStatement({}, {
				action: 's3:putObject',
				resource: 'my-bucket-resource'
			});

			assert.deepStrictEqual(result, {
				iamRoleStatements: [
					{
						Effect: 'Allow',
						Action: 's3:putObject',
						Resource: 'my-bucket-resource'
					}
				]
			});
		});

		it('Should generate a new statement with one action and resource', () => {

			const result = iamStatement({}, {
				effect: 'Allow',
				action: 's3:putObject',
				resource: 'my-bucket-resource'
			});

			assert.deepStrictEqual(result, {
				iamRoleStatements: [
					{
						Effect: 'Allow',
						Action: 's3:putObject',
						Resource: 'my-bucket-resource'
					}
				]
			});
		});

		it('Should generate a new statement with multiple actions and resources', () => {

			const result = iamStatement({}, {
				effect: 'Allow',
				action: ['s3:putObject', 's3:getObject'],
				resource: ['my-bucket-resource', 'my-other-bucket-resource']
			});

			assert.deepStrictEqual(result, {
				iamRoleStatements: [
					{
						Effect: 'Allow',
						Action: ['s3:putObject', 's3:getObject'],
						Resource: ['my-bucket-resource', 'my-other-bucket-resource']
					}
				]
			});
		});

		it('Should append to previous IAM statements', () => {

			const result = iamStatement({
				iamRoleStatements: [
					{
						Effect: 'Allow',
						Action: 's3:putObject',
						Resource: 'my-previous-bucket-resource'
					}
				]
			}, {
				effect: 'Deny',
				action: 's3:putObject',
				resource: 'my-bucket-resource'
			});

			assert.deepStrictEqual(result, {
				iamRoleStatements: [
					{
						Effect: 'Allow',
						Action: 's3:putObject',
						Resource: 'my-previous-bucket-resource'
					},
					{
						Effect: 'Deny',
						Action: 's3:putObject',
						Resource: 'my-bucket-resource'
					}
				]
			});
		});
	});
});
