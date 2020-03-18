'use strict';

const assert = require('assert').strict;

const { resource } = require('../../.././../lib/plugins/core');

describe('Core plugins', () => {

	describe('Resource', () => {

		const sampleResource = {
			Type: 'AWS::S3::BucketPolicy',
			Properties: {
				Bucket: 'Some bucket',
				PolicyDocument: {}
			}
		};

		it('Should throw if no configuration is passed', () => {
			assert.throws(() => resource({}));
		});

		it('Should throw if invalid configuration is passed', () => {
			assert.throws(() => resource({}, 8));
			assert.throws(() => resource({}, 'invalid'));
			assert.throws(() => resource({}, ['invalid']));
		});

		it('Should throw if an empty object of configuration is passed', () => {
			assert.throws(() => resource({}, {}));
		});

		it('Should throw if no name is passed', () => {
			assert.throws(() => resource({}, {
				resource: { ...sampleResource }
			}));
		});

		it('Should throw if an invalid name is passed', () => {
			assert.throws(() => resource({}, {
				name: ['Not a string'],
				resource: { ...sampleResource }
			}));
		});

		it('Should throw if no resource is passed', () => {
			assert.throws(() => resource({}, {
				name: 'MyBucket'
			}));
		});

		it('Should throw if an invalid resource is passed (1)', () => {
			assert.throws(() => resource({}, {
				name: 'MyBucket',
				resource: 'Not an object'
			}));
		});

		it('Should throw if an invalid resource is passed (2)', () => {
			assert.throws(() => resource({}, {
				name: 'MyBucket',
				resource: ['Still not an object']
			}));
		});

		it('Should throw if an empty resource is passed', () => {
			assert.throws(() => resource({}, {
				name: 'MyBucket',
				resource: {}
			}));
		});

		it('Should generate the resources object and set the resource if resources is not set', () => {
			const result = resource({}, {
				name: 'MyBucket',
				resource: { ...sampleResource }
			});

			assert.deepStrictEqual(result, {
				resources: {
					Resources: {
						MyBucket: sampleResource
					}
				}
			});
		});

		it('Should generate the resources.Resources object and set the resource if resources.Resources is not set', () => {
			const result = resource({
				resources: {}
			}, {
				name: 'MyBucket',
				resource: { ...sampleResource }
			});

			assert.deepStrictEqual(result, {
				resources: {
					Resources: {
						MyBucket: sampleResource
					}
				}
			});
		});

		it('Should add the resource to resources.Resources when it\'s an object', () => {
			const result = resource({
				resources: {
					Resources: {
						ExistingResource: {
							Type: 'Some type',
							Properties: {}
						}
					}
				}
			}, {
				name: 'MyBucket',
				resource: { ...sampleResource }
			});

			assert.deepStrictEqual(result, {
				resources: {
					Resources: {
						ExistingResource: {
							Type: 'Some type',
							Properties: {}
						},
						MyBucket: sampleResource
					}
				}
			});
		});

		it('Should add the resource to resources.Resources when it\'s an array', () => {
			const result = resource({
				resources: {
					Resources: [{
						ExistingResource: {
							Type: 'Some type',
							Properties: {}
						}
					}]
				}
			}, {
				name: 'MyBucket',
				resource: { ...sampleResource }
			});

			assert.deepStrictEqual(result, {
				resources: {
					Resources: [
						{
							ExistingResource: {
								Type: 'Some type',
								Properties: {}
							}
						},
						{
							MyBucket: sampleResource
						}
					]
				}
			});
		});
	});
});
