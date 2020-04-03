'use strict';

const { inspect } = require('util');

const CUSTOM_ROLE_POLICY_NAME = 'sls-helper-custom-policy';

const notAString = x => typeof x !== 'string';

const addToIamStatements = ({ provider = {}, ...serviceConfig }, statement) => {

	const { iamRoleStatements = [] } = provider;

	return {
		...serviceConfig,
		provider: {
			...provider,
			iamRoleStatements: [
				...iamRoleStatements,
				statement
			]
		}
	};
};

const findCustomRoleResource = (resources, roleLogicalName) => {
	if(!Array.isArray(resources))
		return resources[roleLogicalName];

	const positionWithResource = resources.find(resourcesPosition => !!resourcesPosition[roleLogicalName]);

	return positionWithResource && positionWithResource[roleLogicalName];
};

const findOrCreatePolicy = roleResource => {

	const existingPolicy = roleResource.Properties.Policies.find(({ PolicyName }) => PolicyName === CUSTOM_ROLE_POLICY_NAME);

	if(existingPolicy)
		return existingPolicy;

	const newPolicy = {
		PolicyName: CUSTOM_ROLE_POLICY_NAME,
		PolicyDocument: {
			Version: '2012-10-17',
			Statement: [
			]
		}
	};

	roleResource.Properties.Policies.push(newPolicy);

	return newPolicy;
};

const addToCustomRole = (roleLogicalName, serviceConfig, statement) => {

	const resourcesProp = (serviceConfig.resources && serviceConfig.resources.Resources) || {};

	const customRoleResource = findCustomRoleResource(resourcesProp, roleLogicalName);

	if(!customRoleResource)
		throw new Error(`Could not find role ${roleLogicalName} in resources`);

	const policy = findOrCreatePolicy(customRoleResource);

	policy.PolicyDocument.Statement.push(statement);

	return serviceConfig;
};

module.exports = (serviceConfig, {
	effect = 'Allow',
	action,
	resource
}) => {

	const { provider = {} } = serviceConfig;

	const customRole = provider.role;

	if(customRole && (typeof customRole !== 'string' || customRole.startsWith('arn:aws:')))
		throw new Error(`Cannot add IAM Statement to role ${inspect(customRole)}`);

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

	const statement = {
		Effect: effect,
		Action: action,
		Resource: resource
	};

	if(!customRole)
		return addToIamStatements(serviceConfig, statement);

	return addToCustomRole(customRole, serviceConfig, statement);
};
