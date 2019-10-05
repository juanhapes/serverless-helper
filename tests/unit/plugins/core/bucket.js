'use strict';

const assert = require('assert').strict;

const bucket = require('../../.././../lib/plugins/core/bucket');

describe('Core plugins', () => {

	describe('Bucket', () => {

		it('Should return an object with the default bucket configuration', () => {

			const bucketResult = bucket({
				resourceName: 'MyBucket',
				name: 'my-bucket'
			});

			assert.deepStrictEqual(bucketResult, {
				MyBucket: {
					Type: 'AWS::S3::Bucket',
					Properties: {
						AccessControl: 'Private',
						PublicAccessBlockConfiguration: {
							BlockPublicAcls: true,
							BlockPublicPolicy: true,
							IgnorePublicAcls: true,
							RestrictPublicBuckets: true
						},
						BucketName: 'my-bucket'
					}
				}
			});
		});

		it('Should return an object with the default bucket configuration', () => {

			const bucketResult = bucket({
				resourceName: 'MyBucket',
				name: 'my-bucket',
				acl: 'MyAcl'
			});

			assert.deepStrictEqual(bucketResult, {
				MyBucket: {
					Type: 'AWS::S3::Bucket',
					Properties: {
						AccessControl: 'MyAcl',
						PublicAccessBlockConfiguration: {
							BlockPublicAcls: true,
							BlockPublicPolicy: true,
							IgnorePublicAcls: true,
							RestrictPublicBuckets: true
						},
						BucketName: 'my-bucket'
					}
				}
			});
		});

	});

});
