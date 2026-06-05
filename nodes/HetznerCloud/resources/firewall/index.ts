import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	firewallLocator,
	labelSelectorOption,
	limitField,
	pageOption,
	unwrap,
} from '../../shared/descriptions';
import { buildFirewallBody, mergeAdditionalJson } from '../../shared/preSend';

const showFor = { resource: ['firewall'] };
const actionPath = (verb: string) => `=/v1/firewalls/{{ $parameter.firewallId }}/actions/${verb}`;

const rulesField: INodeProperties = {
	displayName: 'Rules (JSON)',
	name: 'rulesJson',
	type: 'json',
	default: '[]',
	displayOptions: { show: { ...showFor, operation: ['create', 'setRules'] } },
	description:
		'An array of firewall rules, e.g. [{"direction":"in","protocol":"tcp","port":"443","source_ips":["0.0.0.0/0","::/0"]}]. For Set Rules this replaces all existing rules.',
};

export const firewallDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Apply to Resources',
				value: 'applyToResources',
				action: 'Apply a firewall to resources',
				description: 'Apply the firewall to servers or label selectors',
				routing: {
					send: { preSend: [mergeAdditionalJson] },
					request: { method: 'POST', url: actionPath('apply_to_resources') },
					...unwrap('actions'),
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a firewall',
				description: 'Create a new firewall',
				routing: {
					send: { preSend: [buildFirewallBody, mergeAdditionalJson] },
					request: { method: 'POST', url: '/v1/firewalls' },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a firewall',
				description: 'Delete a firewall',
				routing: { request: { method: 'DELETE', url: '=/v1/firewalls/{{ $parameter.firewallId }}' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a firewall',
				description: 'Retrieve a single firewall by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/firewalls/{{ $parameter.firewallId }}' },
					...unwrap('firewall'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many firewalls',
				description: 'List firewalls in the project',
				routing: { request: { method: 'GET', url: '/v1/firewalls' }, ...unwrap('firewalls') },
			},
			{
				name: 'Remove From Resources',
				value: 'removeFromResources',
				action: 'Remove a firewall from resources',
				description: 'Remove the firewall from servers or label selectors',
				routing: {
					send: { preSend: [mergeAdditionalJson] },
					request: { method: 'POST', url: actionPath('remove_from_resources') },
					...unwrap('actions'),
				},
			},
			{
				name: 'Set Rules',
				value: 'setRules',
				action: 'Set firewall rules',
				description: 'Replace all rules of a firewall',
				routing: {
					send: { preSend: [buildFirewallBody] },
					request: { method: 'POST', url: actionPath('set_rules') },
					...unwrap('actions'),
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a firewall',
				description: 'Update an existing firewall (name and labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/firewalls/{{ $parameter.firewallId }}' },
					...unwrap('firewall'),
				},
			},
		],
		default: 'getAll',
	},

	firewallLocator(
		{
			...showFor,
			operation: ['get', 'delete', 'update', 'setRules', 'applyToResources', 'removeFromResources'],
		},
		{ inPath: true },
	),

	// Create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['create'] } },
		placeholder: 'e.g. web-firewall',
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A unique name for the firewall',
	},
	rulesField,
	additionalBodyJsonField({ ...showFor, operation: ['create', 'update'] }),

	// Update
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A new unique name for the firewall',
	},

	// Apply / remove
	{
		displayName: 'Apply / Remove Targets (JSON)',
		name: 'additionalBodyJson',
		type: 'json',
		default: '{}',
		displayOptions: { show: { ...showFor, operation: ['applyToResources', 'removeFromResources'] } },
		description:
			'For Apply provide an "apply_to" array of resource references; for Remove provide a "remove_from" array. See the Hetzner Cloud API reference for the structure.',
	},

	limitField({ ...showFor, operation: ['getAll'] }),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showFor, operation: ['getAll'] } },
		options: [
			pageOption,
			labelSelectorOption,
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'name', value: '={{ $value }}' } },
				description: 'Filter firewalls by their exact name',
			},
		],
	},
];
