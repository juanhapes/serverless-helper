'use strict';

const { inspect } = require('util');

const notAString = x => typeof x !== 'string';

module.exports = ({ iamRoleStatements, ...serviceConfig }, {
	effect = 'Allow',
	action,
	resource
}) => {

	// Effect is an enum
	if(!effect)
		throw new Error(`Missing or empty 'effect' hook configuration in API hook: ${inspect(effect)}`);

	if(effect !== 'Allow' && effect !== 'Deny')
		throw new Error(`Invalid 'effect' hook configuration in API hook: ${inspect(effect)}`);

	// Action should be an array of strings
	if(!action || !action.length)
		throw new Error(`Missing or empty 'action' hook configuration in API hook: ${inspect(action)}`);

	const actionAsArray = Array.isArray(action) ? action : [action];
	if(actionAsArray.some(notAString))
		throw new Error(`Invalid 'action' hook configuration in API hook: ${inspect(action)}`);

	// Resource should be an array of strings
	if(!resource || !resource.length)
		throw new Error(`Missing or empty 'resource' hook configuration in API hook: ${inspect(resource)}`);

	const resourceAsArray = Array.isArray(resource) ? resource : [resource];
	if(resourceAsArray.some(notAString))
		throw new Error(`Invalid 'resource' hook configuration in API hook: ${inspect(resource)}`);

	return {
		...serviceConfig,
		iamRoleStatements: [
			...(iamRoleStatements || []),
			{
				Effect: effect,
				Action: action,
				Resource: resource
			}
		]
	};
};
