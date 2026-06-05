import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	labelSelectorOption,
	limitField,
	networkLocator,
	pageOption,
	unwrap,
} from '../../shared/descriptions';

const showFor = { resource: ['network'] };
const showCreate = { ...showFor, operation: ['create'] };
const actionPath = (verb: string) => `=/v1/networks/{{ $parameter.networkId }}/actions/${verb}`;

export const networkDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Add Route',
				value: 'addRoute',
				action: 'Add a route to a network',
				description: 'Add a route to a network',
				routing: { request: { method: 'POST', url: actionPath('add_route') }, ...unwrap('action') },
			},
			{
				name: 'Add Subnet',
				value: 'addSubnet',
				action: 'Add a subnet to a network',
				description: 'Add a subnet to a network',
				routing: { request: { method: 'POST', url: actionPath('add_subnet') }, ...unwrap('action') },
			},
			{
				name: 'Change IP Range',
				value: 'changeIpRange',
				action: 'Change the IP range of a network',
				description: 'Change the IP range of a network',
				routing: {
					request: { method: 'POST', url: actionPath('change_ip_range') },
					...unwrap('action'),
				},
			},
			{
				name: 'Change Protection',
				value: 'changeProtection',
				action: 'Change network protection',
				description: 'Change the delete protection of a network',
				routing: {
					request: { method: 'POST', url: actionPath('change_protection') },
					...unwrap('action'),
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a network',
				description: 'Create a new network',
				routing: { request: { method: 'POST', url: '/v1/networks' }, ...unwrap('network') },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a network',
				description: 'Delete a network',
				routing: { request: { method: 'DELETE', url: '=/v1/networks/{{ $parameter.networkId }}' } },
			},
			{
				name: 'Delete Route',
				value: 'deleteRoute',
				action: 'Delete a route from a network',
				description: 'Delete a route from a network',
				routing: { request: { method: 'POST', url: actionPath('del_route') }, ...unwrap('action') },
			},
			{
				name: 'Delete Subnet',
				value: 'deleteSubnet',
				action: 'Delete a subnet from a network',
				description: 'Delete a subnet from a network',
				routing: { request: { method: 'POST', url: actionPath('del_subnet') }, ...unwrap('action') },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a network',
				description: 'Retrieve a single network by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/networks/{{ $parameter.networkId }}' },
					...unwrap('network'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many networks',
				description: 'List networks in the project',
				routing: { request: { method: 'GET', url: '/v1/networks' }, ...unwrap('networks') },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a network',
				description: 'Update an existing network (name and labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/networks/{{ $parameter.networkId }}' },
					...unwrap('network'),
				},
			},
		],
		default: 'getAll',
	},

	networkLocator(
		{
			...showFor,
			operation: [
				'get',
				'delete',
				'update',
				'addRoute',
				'addSubnet',
				'deleteRoute',
				'deleteSubnet',
				'changeIpRange',
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
		placeholder: 'e.g. my-network',
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A unique name for the network',
	},
	{
		displayName: 'IP Range',
		name: 'ipRange',
		type: 'string',
		default: '10.0.0.0/16',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['create', 'changeIpRange'] } },
		placeholder: 'e.g. 10.0.0.0/16',
		routing: { send: { type: 'body', property: 'ip_range', value: '={{ $value }}' } },
		description: 'The IP range of the whole network in CIDR notation',
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
		description: 'A new unique name for the network',
	},

	// Add subnet
	{
		displayName: 'Type',
		name: 'subnetType',
		type: 'options',
		options: [
			{ name: 'Cloud', value: 'cloud' },
			{ name: 'Server', value: 'server' },
			{ name: 'vSwitch', value: 'vswitch' },
		],
		default: 'cloud',
		displayOptions: { show: { ...showFor, operation: ['addSubnet'] } },
		routing: { send: { type: 'body', property: 'type', value: '={{ $value }}' } },
		description: 'The type of subnet',
	},
	{
		displayName: 'Network Zone',
		name: 'networkZone',
		type: 'string',
		default: 'eu-central',
		displayOptions: { show: { ...showFor, operation: ['addSubnet'] } },
		placeholder: 'e.g. eu-central',
		routing: { send: { type: 'body', property: 'network_zone', value: '={{ $value }}' } },
		description: 'The network zone the subnet resides in',
	},
	{
		displayName: 'IP Range',
		name: 'subnetIpRange',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['addSubnet', 'deleteSubnet'] } },
		placeholder: 'e.g. 10.0.1.0/24',
		routing: { send: { type: 'body', property: 'ip_range', value: '={{ $value }}' } },
		description: 'The IP range of the subnet in CIDR notation',
	},

	// Add / delete route
	{
		displayName: 'Destination',
		name: 'destination',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['addRoute', 'deleteRoute'] } },
		placeholder: 'e.g. 10.100.1.0/24',
		routing: { send: { type: 'body', property: 'destination', value: '={{ $value }}' } },
		description: 'The destination network or host of the route in CIDR notation',
	},
	{
		displayName: 'Gateway',
		name: 'gateway',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['addRoute', 'deleteRoute'] } },
		placeholder: 'e.g. 10.0.1.1',
		routing: { send: { type: 'body', property: 'gateway', value: '={{ $value }}' } },
		description: 'The gateway for the route',
	},

	// Change protection
	{
		displayName: 'Delete Protection',
		name: 'deleteProtection',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showFor, operation: ['changeProtection'] } },
		routing: { send: { type: 'body', property: 'delete', value: '={{ $value }}' } },
		description: 'Whether the network is protected against deletion',
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
				description: 'Filter networks by their exact name',
			},
		],
	},
];
