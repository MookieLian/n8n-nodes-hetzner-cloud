import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	labelSelectorOption,
	limitField,
	loadBalancerLocator,
	pageOption,
	unwrap,
} from '../../shared/descriptions';
import { mergeAdditionalJson } from '../../shared/preSend';

const showFor = { resource: ['loadBalancer'] };
const showCreate = { ...showFor, operation: ['create'] };
const actionPath = (verb: string) => `=/v1/load_balancers/{{ $parameter.loadBalancerId }}/actions/${verb}`;

const algorithmOptions = [
	{ name: 'Least Connections', value: 'least_connections' },
	{ name: 'Round Robin', value: 'round_robin' },
];

export const loadBalancerDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Add Service',
				value: 'addService',
				action: 'Add a service to a load balancer',
				description: 'Add a service to a load balancer',
				routing: {
					send: { preSend: [mergeAdditionalJson] },
					request: { method: 'POST', url: actionPath('add_service') },
					...unwrap('action'),
				},
			},
			{
				name: 'Add Target',
				value: 'addTarget',
				action: 'Add a target to a load balancer',
				description: 'Add a target to a load balancer',
				routing: {
					send: { preSend: [mergeAdditionalJson] },
					request: { method: 'POST', url: actionPath('add_target') },
					...unwrap('action'),
				},
			},
			{
				name: 'Change Algorithm',
				value: 'changeAlgorithm',
				action: 'Change the load balancer algorithm',
				description: 'Change the algorithm of a load balancer',
				routing: {
					request: { method: 'POST', url: actionPath('change_algorithm') },
					...unwrap('action'),
				},
			},
			{
				name: 'Change Protection',
				value: 'changeProtection',
				action: 'Change load balancer protection',
				description: 'Change the delete protection of a load balancer',
				routing: {
					request: { method: 'POST', url: actionPath('change_protection') },
					...unwrap('action'),
				},
			},
			{
				name: 'Change Type',
				value: 'changeType',
				action: 'Change the load balancer type',
				description: 'Change the type of a load balancer',
				routing: {
					request: { method: 'POST', url: actionPath('change_type') },
					...unwrap('action'),
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a load balancer',
				description: 'Create a new load balancer',
				routing: { request: { method: 'POST', url: '/v1/load_balancers' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a load balancer',
				description: 'Delete a load balancer',
				routing: {
					request: { method: 'DELETE', url: '=/v1/load_balancers/{{ $parameter.loadBalancerId }}' },
				},
			},
			{
				name: 'Delete Service',
				value: 'deleteService',
				action: 'Delete a service from a load balancer',
				description: 'Delete a service from a load balancer',
				routing: {
					request: { method: 'POST', url: actionPath('delete_service') },
					...unwrap('action'),
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a load balancer',
				description: 'Retrieve a single load balancer by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/load_balancers/{{ $parameter.loadBalancerId }}' },
					...unwrap('load_balancer'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many load balancers',
				description: 'List load balancers in the project',
				routing: {
					request: { method: 'GET', url: '/v1/load_balancers' },
					...unwrap('load_balancers'),
				},
			},
			{
				name: 'Remove Target',
				value: 'removeTarget',
				action: 'Remove a target from a load balancer',
				description: 'Remove a target from a load balancer',
				routing: {
					send: { preSend: [mergeAdditionalJson] },
					request: { method: 'POST', url: actionPath('remove_target') },
					...unwrap('action'),
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a load balancer',
				description: 'Update an existing load balancer (name and labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/load_balancers/{{ $parameter.loadBalancerId }}' },
					...unwrap('load_balancer'),
				},
			},
		],
		default: 'getAll',
	},

	loadBalancerLocator(
		{
			...showFor,
			operation: [
				'get',
				'delete',
				'update',
				'addService',
				'deleteService',
				'addTarget',
				'removeTarget',
				'changeAlgorithm',
				'changeType',
				'changeProtection',
			],
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
		displayOptions: { show: showCreate },
		placeholder: 'e.g. web-lb',
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A unique name for the load balancer',
	},
	{
		displayName: 'Load Balancer Type',
		name: 'loadBalancerType',
		type: 'string',
		default: 'lb11',
		required: true,
		displayOptions: { show: showCreate },
		placeholder: 'e.g. lb11',
		routing: { send: { type: 'body', property: 'load_balancer_type', value: '={{ $value }}' } },
		description: 'The name or ID of the load balancer type',
	},
	{
		displayName: 'Location',
		name: 'location',
		type: 'string',
		default: '',
		displayOptions: { show: showCreate },
		placeholder: 'e.g. nbg1',
		routing: { send: { type: 'body', property: 'location', value: '={{ $value }}' } },
		description: 'The location name (provide this or Network Zone)',
	},
	{
		displayName: 'Network Zone',
		name: 'networkZone',
		type: 'string',
		default: '',
		displayOptions: { show: showCreate },
		placeholder: 'e.g. eu-central',
		routing: { send: { type: 'body', property: 'network_zone', value: '={{ $value }}' } },
		description: 'The network zone (provide this or Location)',
	},
	{
		displayName: 'Algorithm',
		name: 'algorithm',
		type: 'options',
		options: algorithmOptions,
		default: 'round_robin',
		displayOptions: { show: showCreate },
		routing: { send: { type: 'body', property: 'algorithm', value: '={{ ({ type: $value }) }}' } },
		description: 'The algorithm the load balancer uses to distribute traffic',
	},
	additionalBodyJsonField({ ...showFor, operation: ['create', 'update'] }),

	// Update
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A new unique name for the load balancer',
	},

	// Change Algorithm
	{
		displayName: 'Algorithm',
		name: 'algorithmType',
		type: 'options',
		options: algorithmOptions,
		default: 'round_robin',
		displayOptions: { show: { ...showFor, operation: ['changeAlgorithm'] } },
		routing: { send: { type: 'body', property: 'type', value: '={{ $value }}' } },
		description: 'The new algorithm the load balancer should use',
	},

	// Change Type
	{
		displayName: 'Load Balancer Type',
		name: 'loadBalancerType',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['changeType'] } },
		placeholder: 'e.g. lb21',
		routing: { send: { type: 'body', property: 'load_balancer_type', value: '={{ $value }}' } },
		description: 'The name or ID of the new load balancer type',
	},

	// Delete Service
	{
		displayName: 'Listen Port',
		name: 'listenPort',
		type: 'number',
		default: 80,
		required: true,
		displayOptions: { show: { ...showFor, operation: ['deleteService'] } },
		routing: { send: { type: 'body', property: 'listen_port', value: '={{ $value }}' } },
		description: 'The listen port of the service to delete',
	},

	// Change Protection
	{
		displayName: 'Delete Protection',
		name: 'deleteProtection',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showFor, operation: ['changeProtection'] } },
		routing: { send: { type: 'body', property: 'delete', value: '={{ $value }}' } },
		description: 'Whether the load balancer is protected against deletion',
	},

	// Add/Remove service & target (JSON body)
	{
		displayName: 'Service / Target (JSON)',
		name: 'additionalBodyJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: { ...showFor, operation: ['addService', 'addTarget', 'removeTarget'] },
		},
		description:
			'The service or target object as JSON. For Add Service provide protocol, listen_port and destination_port. For Add/Remove Target provide a type and the target resource. See the Hetzner Cloud API reference.',
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
				description: 'Filter load balancers by their exact name',
			},
		],
	},
];
