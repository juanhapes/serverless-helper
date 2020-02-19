'use strict';

const assert = require('assert').strict;

const { bucket } = require('../../.././../lib/plugins/core');

describe('Core plugins', () => {

	describe('Bucket', () => {

		it('Should return an object with the default bucket configuration', () => {

			const bucketResult = bucket({}, {
				resourceName: 'MyBucket',
				name: 'my-bucket'
			});

			assert.deepStrictEqual(bucketResult, {
				resources: {
					Resources: {
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
					}
				}
			});
		});

		it('Should return an object with custom ACL', () => {

			const bucketResult = bucket({}, {
				resourceName: 'MyBucket',
				name: 'my-bucket',
				acl: 'MyAcl'
			});

			assert.deepStrictEqual(bucketResult, {
				resources: {
					Resources: {
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
					}
				}
			});
		});

		it('Should return an object with the default CORS configuration if cors prop is true', () => {

			const bucketResult = bucket({}, {
				resourceName: 'MyBucket',
				name: 'my-bucket',
				cors: true
			});

			assert.deepStrictEqual(bucketResult, {
				resources: {
					Resources: {
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
								BucketName: 'my-bucket',
								CorsConfiguration: {
									CorsRules: [{
										AllowedMethods: ['*'],
										AllowedOrigins: ['*']
									}]
								}
							}
						}
					}
				}
			});
		});

		it('Should return an object with custom CORS configuration with one rule', () => {

			const bucketResult = bucket({}, {
				resourceName: 'MyBucket',
				name: 'my-bucket',
				cors: {
					headers: 'x-foo',
					exposedHeaders: 'x-bar',
					id: 'MyRule',
					maxAge: '60'
				}
			});

			assert.deepStrictEqual(bucketResult, {
				resources: {
					Resources: {
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
								BucketName: 'my-bucket',
								CorsConfiguration: {
									CorsRules: [{
										AllowedMethods: ['*'],
										AllowedOrigins: ['*'],
										AllowedHeaders: ['x-foo'],
										ExposedHeaders: ['x-bar'],
										Id: 'MyRule',
										MaxAge: 60
									}]
								}
							}
						}
					}
				}
			});
		});

		it('Should return an object with custom CORS configuration with multiple rules', () => {

			const bucketResult = bucket({}, {
				resourceName: 'MyBucket',
				name: 'my-bucket',
				cors: [{
					methods: ['GET', 'POST'],
					origin: ['http://example.com', 'http://www.example.com'],
					headers: 'x-foo',
					exposedHeaders: 'x-bar',
					id: 'MyFirstRule',
					maxAge: '60'
				}, {
					origin: true,
					headers: ['x-foo', 'x-foo2'],
					exposedHeaders: ['x-bar', 'x-bar2'],
					id: 'MySecondRule',
					maxAge: 300
				}]
			});

			assert.deepStrictEqual(bucketResult, {
				resources: {
					Resources: {
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
								BucketName: 'my-bucket',
								CorsConfiguration: {
									CorsRules: [{
										AllowedMethods: ['GET', 'POST'],
										AllowedOrigins: ['http://example.com', 'http://www.example.com'],
										AllowedHeaders: ['x-foo'],
										ExposedHeaders: ['x-bar'],
										Id: 'MyFirstRule',
										MaxAge: 60
									}, {
										AllowedMethods: ['*'],
										AllowedOrigins: ['*'],
										AllowedHeaders: ['x-foo', 'x-foo2'],
										ExposedHeaders: ['x-bar', 'x-bar2'],
										Id: 'MySecondRule',
										MaxAge: 300
									}]
								}
							}
						}
					}
				}
			});
		});

		it('Should return an object with tags', () => {

			const bucketResult = bucket({}, {
				resourceName: 'MyBucket',
				name: 'my-bucket',
				tags: {
					foo: 'bar',
					baz: 'yeah'
				}
			});

			assert.deepStrictEqual(bucketResult, {
				resources: {
					Resources: {
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
								BucketName: 'my-bucket',
								Tags: [
									{
										Key: 'foo',
										Value: 'bar'
									},
									{
										Key: 'baz',
										Value: 'yeah'
									}
								]
							}
						}
					}
				}
			});
		});

		it('Should return an object with the raw properties applied', () => {

			const bucketResult = bucket({}, {
				resourceName: 'MyBucket',
				name: 'my-bucket',
				rawProps: {
					DeletionPolicy: 'Retain',
					Tags: [
						{
							Key: 'MyTag',
							Value: 'TheValue'
						}
					]
				}
			});

			assert.deepStrictEqual(bucketResult, {
				resources: {
					Resources: {
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
								BucketName: 'my-bucket',
								DeletionPolicy: 'Retain',
								Tags: [
									{
										Key: 'MyTag',
										Value: 'TheValue'
									}
								]
							}
						}
					}
				}
			});
		});

		it('Should mantain previous resources if they are present', () => {

			const bucketResult = bucket({
				resources: {
					Resources: {
						SomePreviousResource: {
							foo: 'bar'
						}
					}
				}
			}, {
				resourceName: 'MyBucket',
				name: 'my-bucket'
			});

			assert.deepStrictEqual(bucketResult, {
				resources: {
					Resources: {
						SomePreviousResource: {
							foo: 'bar'
						},
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
					}
				}
			});
		});
	});
});
