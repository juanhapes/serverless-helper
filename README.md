# Serverless Helper

A framework to implement serverless framework config fil with ease and standarized resources.

## Usage

## Plugins

## Core Helpers

### bucket

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

### API Lambda Proxy

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
| authorizer | string | The name of the authorizer | Valid authorizers: FullAuthorizer, NoClientAuthorizer | |
| cors | object \| boolean | See the [official documentation](https://serverless.com/framework/docs/providers/aws/events/apigateway#enabling-cors) | | |
| async | boolean | Whether the API will execute as an async lambda or not | | false |
