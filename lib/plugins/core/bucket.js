'use strict';

const defaultCorsConfiguration = {
	origin: '*',
	methods: '*'
};

const buildCorsRule = ({
	id,
	origin,
	headers,
	exposedHeaders,
	methods,
	maxAge
}) => {

	const rule = {
		AllowedMethods: (methods && (Array.isArray(methods) ? methods : [methods])) || ['*'],
		AllowedOrigins: (origin && (Array.isArray(origin) ? origin : [origin === true ? '*' : origin])) || ['*']
	};

	if(headers)
		rule.AllowedHeaders = Array.isArray(headers) ? headers : [headers];

	if(exposedHeaders)
		rule.ExposedHeaders = Array.isArray(exposedHeaders) ? exposedHeaders : [exposedHeaders];

	if(id)
		rule.Id = id;

	if(maxAge)
		rule.MaxAge = Number(maxAge);

	return rule;
};

const buildCorsConfiguration = cors => {

	if(cors === true)
		cors = { ...defaultCorsConfiguration };

	if(!Array.isArray(cors))
		cors = [cors];

	return {
		CorsConfiguration: {
			CorsRules: cors.map(corsRule => buildCorsRule(corsRule))
		}
	};
};

module.exports = ({
	resourceName,
	name,
	acl,
	cors,
	rawProps
}) => ({
	[resourceName]: {
		Type: 'AWS::S3::Bucket',
		Properties: {
			AccessControl: acl || 'Private',
			PublicAccessBlockConfiguration: {
				BlockPublicAcls: true,
				BlockPublicPolicy: true,
				IgnorePublicAcls: true,
				RestrictPublicBuckets: true
			},
			BucketName: name,
			...(cors ? buildCorsConfiguration(cors) : {}),
			...(rawProps || {})
		}
	}
});
