# Serverless Helper

A framework to implement serverless framework config file with ease and standarized resources.

## Installation
```sh
npm install sls-helper
```

## Usage

```js
// serverless.js

const { helper } = require('sls-helper');

module.exports = helper({
	hooks: [

		['bucket', {
			resourceName: 'ServiceBucket',
			name: 'my-bucket'
		}],

		'custom.myHelperWithoutConfigs'
	]
});
```

## Plugins

In order to implement a plugin for the framework, you must publish a package with the following pattern: `sls-helper-plugin-{plugin-name}`.

The `plugin-name` must then be used as a prefix to use a helper of that plugin, for example: `plugin-name.helperName`

The package must export an object mapping helper names to helper implementations.

Each helper is a function that receives the following arguments:

* `serviceConfig`: The current service config object
* `helperParams`: The (optional) configuration for the helper.

It also has to return the new service config object.

Plugin list:

- [JANIS](https://www.npmjs.com/package/sls-helper-plugin-janis)

## Core Helpers

### S3 Bucket (bucket)

Used to implement a bucket with blocked public access

| Option | Type | Description | Attributes | Default value |
|--------|------|-------------|------------|---------------|
| resourceName | string | The logical name of the bucket | **Required** | |
| name | string | The bucket name | **Required** | |
| acl | string | The bucket acl | | Private |
| cors | boolean \| object \| array | The bucket CORS configuration. If set to `true`, default configuration is set (every origin, every header) | | |
| cors.id, cors[].id | string | The CORS rule ID | | |
| cors.origin, cors[].origin | array \| string \| boolean | The CORS rule origin(s) (if value is `true`, it's set as every origin) | | |
| cors.methods, cors[].methods | array \| string | The CORS rule method(s) | | |
| cors.headers, cors[].headers | array \| string | The CORS rule headers(s) | | |
| cors.exposedHeaders, cors[].exposedHeaders | array \| string | The CORS rule exposed headers(s) | | |
| cors.maxAge, cors[].maxAge | number | The CORS rule max age | | |
| rawProps | object | Extra raw properties | See the [official documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket.html) | |

#### Example

```js
const { helper } = require('sls-helper');

module.exports = helper({
	hooks: [
		['bucket', {
			resourceName: 'ServiceBucket',
			name: 'my-bucket'
		}]
	]
});
```

### IAM Role Statement (iamStatement)

_(since 1.2.0)_

Used to implement an IAM Role statement for your service

| Option | Type | Description | Attributes | Default value |
|--------|------|-------------|------------|---------------|
| effect | string | The IAM statement effect | Enum('Allow', 'Deny') | `'Allow'` |
| action | string \| array\<string\> | The IAM statement action | **Required** | |
| resource | string \| array\<string\> | The IAM statement resource | **Required** | |

#### Example

```js
const { helper } = require('sls-helper');

module.exports = helper({
	hooks: [
		['iamStatement', {
			action: [
				's3:PutObject',
				's3:GetObject'
			],
			resource: 'arn:aws:s3:::my-bucket/*'
		}]
	]
});
```

### API Lambda Proxy (apiLambdaProxy)

Used to implement Lambda Proxy APIs

| Option | Type | Description | Attributes | Default value |
|--------|------|-------------|------------|---------------|
| functionName | string | The function name | **Required** | |
| handler | string | The function handler | **Required** | |
| description | string | The function description | | |
| path | string | The API path | **Required** | |
| method | string | The API HTTP method | **Required** | |
| useApiKey | boolean | Whether the API requires API key or not | | false |
| queryParameters | object | A key value to map query string parameters to a boolean indicating if it's required or not | | |
| requestHeaders | object | A key value to map headers to a boolean indicating if it's required or not | | |
| authorizer | string | The authorizer config | See the [official documentation](https://serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-aws_iam-authorizers) | |
| cors | object \| boolean | See the [official documentation](https://serverless.com/framework/docs/providers/aws/events/apigateway#enabling-cors) | | |
| async | boolean | Whether the API will execute as an async lambda or not | | false |

#### Example

```js
const { helper } = require('sls-helper');

module.exports = helper({
	hooks: [
		['apiLambdaProxy', {
			functionName: 'MyFunctionName',
			handler: 'path/to/my.handler',
			path: '/hello-world',
			method: 'get'
		}]
	]
});
```

### Lambda Function (function)

_(since 1.1.0)_

Used to implement Lambda Functions (with no events)

| Option | Type | Description | Attributes | Default value |
|--------|------|-------------|------------|---------------|
| functionName | string | The function name | **Required** | |
| handler | string | The function handler | **Required** | |
| description | string | The function description | | |

#### Example

```js
const { helper } = require('sls-helper');

module.exports = helper({
	hooks: [
		['function', {
			functionName: 'MyFunctionName',
			handler: 'path/to/my.handler'
		}]
	]
});
```

### Environment variables (envVars)

_(since 1.3.0)_

Used to implement environment variables

Configuration options are the environment variables key-value object

#### Example

```js
const { helper } = require('sls-helper');

module.exports = helper({
	hooks: [
		['envVars', {
			MY_VAR: 'and the value',
			SOME_OTHER_VAR: 'and some other value'
		}]
	]
});
```
