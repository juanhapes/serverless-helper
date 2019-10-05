'use strict';

module.exports = ({ resourceName, name, acl }) => ({
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
			BucketName: name
		}
	}
});
