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
				provider: {
					iamRoleStatements: [
						{
							Effect: 'Allow',
							Action: 's3:putObject',
							Resource: 'my-bucket-resource'
						}
					]
				}
			});
		});

		it('Should generate a new statement with one action and resource', () => {

			const result = iamStatement({}, {
				effect: 'Allow',
				action: 's3:putObject',
				resource: 'my-bucket-resource'
			});

			assert.deepStrictEqual(result, {
				provider: {
					iamRoleStatements: [
						{
							Effect: 'Allow',
							Action: 's3:putObject',
							Resource: 'my-bucket-resource'
						}
					]
				}
			});
		});

		it('Should generate a new statement with multiple actions and resources', () => {

			const result = iamStatement({}, {
				effect: 'Allow',
				action: ['s3:putObject', 's3:getObject'],
				resource: ['my-bucket-resource', 'my-other-bucket-resource']
			});

			assert.deepStrictEqual(result, {
				provider: {
					iamRoleStatements: [
						{
							Effect: 'Allow',
							Action: ['s3:putObject', 's3:getObject'],
							Resource: ['my-bucket-resource', 'my-other-bucket-resource']
						}
					]
				}
			});
		});

		it('Should append to previous IAM statements', () => {

			const result = iamStatement({
				provider: {
					iamRoleStatements: [
						{
							Effect: 'Allow',
							Action: 's3:putObject',
							Resource: 'my-previous-bucket-resource'
						}
					]
				}
			}, {
				effect: 'Deny',
				action: 's3:putObject',
				resource: 'my-bucket-resource'
			});

			assert.deepStrictEqual(result, {
				provider: {
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
				}
			});
		});

		context('When a custom role is defined', () => {

			it('Should throw if custom role is not a string', () => {
				assert.throws(() => iamStatement({
					provider: {
						role: ['ServiceExecutionRole']
					}
				}, {
					action: 's3:putObject',
					resource: 'my-bucket-resource'
				}));
			});

			it('Should throw if custom role is an external ARN', () => {
				assert.throws(() => iamStatement({
					provider: {
						role: 'aws:arn:xxxxxxx:some:resource'
					}
				}, {
					action: 's3:putObject',
					resource: 'my-bucket-resource'
				}));
			});

			it('Should throw if resources property is not defined', () => {
				assert.throws(() => iamStatement({
					provider: {
						role: 'ServiceExecutionRole'
					}
				}, {
					action: 's3:putObject',
					resource: 'my-bucket-resource'
				}));
			});

			it('Should throw if resources.Resources property is not defined', () => {
				assert.throws(() => iamStatement({
					provider: {
						role: 'ServiceExecutionRole'
					},
					resources: {}
				}, {
					action: 's3:putObject',
					resource: 'my-bucket-resource'
				}));
			});

			it('Should throw if the role is not in the Resources (as object)', () => {
				assert.throws(() => iamStatement({
					provider: {
						role: 'ServiceExecutionRole'
					},
					resources: {
						Resources: {
							MyBucket: {
								Type: 'AWS::Bucket'
							}
						}
					}
				}, {
					action: 's3:putObject',
					resource: 'my-bucket-resource'
				}));
			});

			it('Should throw if the role is not in the Resources (as array of objects)', () => {
				assert.throws(() => iamStatement({
					provider: {
						role: 'ServiceExecutionRole'
					},
					resources: {
						Resources: [
							{
								MyBucket: {
									Type: 'AWS::Bucket'
								}
							}
						]
					}
				}, {
					action: 's3:putObject',
					resource: 'my-bucket-resource'
				}));
			});

			it('Should create and update the policy on consecutive calls if the role resource is found in the Resources (as object)', () => {

				const result = iamStatement(iamStatement({
					provider: {
						role: 'ServiceExecutionRole'
					},
					resources: {
						Resources: {
							ServiceExecutionRole: {
								Type: 'AWS::IAM::Role',
								Properties: {
									RoleName: 'MyCustomService-lambdaRole',
									Path: '/',
									AssumeRolePolicyDocument: {
										Version: '2012-10-17',
										Statement: [
											{
												Effect: 'Allow',
												Principal: {
													Service: [
														'lambda.amazonaws.com'
													]
												},
												Action: 'sts:AssumeRole'
											}
										]
									},
									Policies: [
										{
											PolicyName: 'some-other-policy',
											PolicyDocument: {
												Version: '2012-10-17',
												Statement: [
													{
														Effect: 'Allow',
														Action: [
															'logs:CreateLogGroup',
															'logs:CreateLogStream',
															'logs:PutLogEvents'
														],
														Resource: [
															{
																'Fn::Join': [
																	':',
																	[
																		'arn:aws:logs',
																		{ Ref: 'AWS::Region' },
																		{ Ref: 'AWS::AccountId' },
																		'log-group:/aws/lambda/*:*'
																	]
																]
															}
														]
													}
												]
											}
										}
									]
								}
							}
						}
					}
				}, {
					action: 's3:putObject',
					resource: 'my-bucket-resource'
				}), {
					action: 's3:getObject',
					resource: 'my-bucket-resource'
				});

				assert.deepStrictEqual(result, {
					provider: {
						role: 'ServiceExecutionRole'
					},
					resources: {
						Resources: {
							ServiceExecutionRole: {
								Type: 'AWS::IAM::Role',
								Properties: {
									RoleName: 'MyCustomService-lambdaRole',
									Path: '/',
									AssumeRolePolicyDocument: {
										Version: '2012-10-17',
										Statement: [
											{
												Effect: 'Allow',
												Principal: {
													Service: [
														'lambda.amazonaws.com'
													]
												},
												Action: 'sts:AssumeRole'
											}
										]
									},
									Policies: [
										{
											PolicyName: 'some-other-policy',
											PolicyDocument: {
												Version: '2012-10-17',
												Statement: [
													{
														Effect: 'Allow',
														Action: [
															'logs:CreateLogGroup',
															'logs:CreateLogStream',
															'logs:PutLogEvents'
														],
														Resource: [
															{
																'Fn::Join': [
																	':',
																	[
																		'arn:aws:logs',
																		{ Ref: 'AWS::Region' },
																		{ Ref: 'AWS::AccountId' },
																		'log-group:/aws/lambda/*:*'
																	]
																]
															}
														]
													}
												]
											}
										},
										{
											PolicyName: 'sls-helper-custom-policy',
											PolicyDocument: {
												Version: '2012-10-17',
												Statement: [
													{
														Effect: 'Allow',
														Action: 's3:putObject',
														Resource: 'my-bucket-resource'
													},
													{
														Effect: 'Allow',
														Action: 's3:getObject',
														Resource: 'my-bucket-resource'
													}
												]
											}
										}
									]
								}
							}
						}
					}
				});
			});

			it('Should create and update the policy on consecutive calls if the role resource is found in the Resources (as array of object)', () => {

				const result = iamStatement(iamStatement({
					provider: {
						role: 'ServiceExecutionRole'
					},
					resources: {
						Resources: [{
							ServiceExecutionRole: {
								Type: 'AWS::IAM::Role',
								Properties: {
									RoleName: 'MyCustomService-lambdaRole',
									Path: '/',
									AssumeRolePolicyDocument: {
										Version: '2012-10-17',
										Statement: [
											{
												Effect: 'Allow',
												Principal: {
													Service: [
														'lambda.amazonaws.com'
													]
												},
												Action: 'sts:AssumeRole'
											}
										]
									},
									Policies: [
										{
											PolicyName: 'some-other-policy',
											PolicyDocument: {
												Version: '2012-10-17',
												Statement: [
													{
														Effect: 'Allow',
														Action: [
															'logs:CreateLogGroup',
															'logs:CreateLogStream',
															'logs:PutLogEvents'
														],
														Resource: [
															{
																'Fn::Join': [
																	':',
																	[
																		'arn:aws:logs',
																		{ Ref: 'AWS::Region' },
																		{ Ref: 'AWS::AccountId' },
																		'log-group:/aws/lambda/*:*'
																	]
																]
															}
														]
													}
												]
											}
										}
									]
								}
							}
						}]
					}
				}, {
					action: 's3:putObject',
					resource: 'my-bucket-resource'
				}), {
					action: 's3:getObject',
					resource: 'my-bucket-resource'
				});

				assert.deepStrictEqual(result, {
					provider: {
						role: 'ServiceExecutionRole'
					},
					resources: {
						Resources: [{
							ServiceExecutionRole: {
								Type: 'AWS::IAM::Role',
								Properties: {
									RoleName: 'MyCustomService-lambdaRole',
									Path: '/',
									AssumeRolePolicyDocument: {
										Version: '2012-10-17',
										Statement: [
											{
												Effect: 'Allow',
												Principal: {
													Service: [
														'lambda.amazonaws.com'
													]
												},
												Action: 'sts:AssumeRole'
											}
										]
									},
									Policies: [
										{
											PolicyName: 'some-other-policy',
											PolicyDocument: {
												Version: '2012-10-17',
												Statement: [
													{
														Effect: 'Allow',
														Action: [
															'logs:CreateLogGroup',
															'logs:CreateLogStream',
															'logs:PutLogEvents'
														],
														Resource: [
															{
																'Fn::Join': [
																	':',
																	[
																		'arn:aws:logs',
																		{ Ref: 'AWS::Region' },
																		{ Ref: 'AWS::AccountId' },
																		'log-group:/aws/lambda/*:*'
																	]
																]
															}
														]
													}
												]
											}
										},
										{
											PolicyName: 'sls-helper-custom-policy',
											PolicyDocument: {
												Version: '2012-10-17',
												Statement: [
													{
														Effect: 'Allow',
														Action: 's3:putObject',
														Resource: 'my-bucket-resource'
													},
													{
														Effect: 'Allow',
														Action: 's3:getObject',
														Resource: 'my-bucket-resource'
													}
												]
											}
										}
									]
								}
							}
						}]
					}
				});
			});
		});
	});
});
