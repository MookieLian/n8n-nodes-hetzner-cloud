import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	floatingIpLocator,
	labelSelectorOption,
	limitField,
	pageOption,
	serverLocator,
	unwrap,
} from '../../shared/descriptions';

const showFor = { resource: ['floatingIp'] };
const showCreate = { ...showFor, operation: ['create'] };
const actionPath = (verb: string) => `=/v1/floating_ips/{{ $parameter.floatingIpId }}/actions/${verb}`;

export const floatingIpDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Assign',
				value: 'assign',
				action: 'Assign a floating ip to a server',
				description: 'Assign a Floating IP to a server',
				routing: { request: { method: 'POST', url: actionPath('assign') }, ...unwrap('action') },
			},
			{
				name: 'Change DNS PTR',
				value: 'changeDnsPtr',
				action: 'Change the reverse dns of a floating ip',
				description: 'Change the reverse DNS (PTR) entry of a Floating IP',
				routing: {
					request: { method: 'POST', url: actionPath('change_dns_ptr') },
					...unwrap('action'),
				},
			},
			{
				name: 'Change Protection',
				value: 'changeProtection',
				action: 'Change floating ip protection',
				description: 'Change the delete protection of a Floating IP',
				routing: {
					request: { method: 'POST', url: actionPath('change_protection') },
					...unwrap('action'),
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a floating ip',
				description: 'Create a new Floating IP',
				routing: { request: { method: 'POST', url: '/v1/floating_ips' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a floating ip',
				description: 'Delete a Floating IP',
				routing: {
					request: { method: 'DELETE', url: '=/v1/floating_ips/{{ $parameter.floatingIpId }}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a floating ip',
				description: 'Retrieve a single Floating IP by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/floating_ips/{{ $parameter.floatingIpId }}' },
					...unwrap('floating_ip'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many floating ips',
				description: 'List Floating IPs in the project',
				routing: { request: { method: 'GET', url: '/v1/floating_ips' }, ...unwrap('floating_ips') },
			},
			{
				name: 'Unassign',
				value: 'unassign',
				action: 'Unassign a floating ip',
				description: 'Unassign a Floating IP from its server',
				routing: { request: { method: 'POST', url: actionPath('unassign') }, ...unwrap('action') },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a floating ip',
				description: 'Update an existing Floating IP (name, description, labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/floating_ips/{{ $parameter.floatingIpId }}' },
					...unwrap('floating_ip'),
				},
			},
		],
		default: 'getAll',
	},

	floatingIpLocator(
		{
			...showFor,
			operation: ['get', 'delete', 'update', 'assign', 'unassign', 'changeDnsPtr', 'changeProtection'],
		},
		{ inPath: true },
	),

	// Create
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'IPv4', value: 'ipv4' },
			{ name: 'IPv6', value: 'ipv6' },
		],
		default: 'ipv4',
		required: true,
		displayOptions: { show: showCreate },
		routing: { send: { type: 'body', property: 'type', value: '={{ $value }}' } },
		description: 'The type of the Floating IP',
	},
	{
		displayName: 'Home Location',
		name: 'homeLocation',
		type: 'string',
		default: '',
		displayOptions: { show: showCreate },
		placeholder: 'e.g. fsn1',
		routing: { send: { type: 'body', property: 'home_location', value: '={{ $value }}' } },
		description: 'The home location name (required unless a server is given)',
	},
	serverLocator({ ...showCreate }, { property: 'server', required: false }),
	additionalBodyJsonField({ ...showFor, operation: ['create', 'update'] }),

	// Update
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A new name for the Floating IP',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'description', value: '={{ $value }}' } },
		description: 'A new description for the Floating IP',
	},

	// Assign
	serverLocator({ ...showFor, operation: ['assign'] }, { property: 'server' }),

	// Change DNS PTR
	{
		displayName: 'IP',
		name: 'ip',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['changeDnsPtr'] } },
		placeholder: 'e.g. 1.2.3.4',
		routing: { send: { type: 'body', property: 'ip', value: '={{ $value }}' } },
		description: 'The IP address for which to set the reverse DNS entry',
	},
	{
		displayName: 'DNS Pointer',
		name: 'dnsPtr',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['changeDnsPtr'] } },
		placeholder: 'e.g. server.example.com',
		routing: { send: { type: 'body', property: 'dns_ptr', value: '={{ $value }}' } },
		description: 'The hostname to set as the reverse DNS entry',
	},

	// Change Protection
	{
		displayName: 'Delete Protection',
		name: 'deleteProtection',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showFor, operation: ['changeProtection'] } },
		routing: { send: { type: 'body', property: 'delete', value: '={{ $value }}' } },
		description: 'Whether the Floating IP is protected against deletion',
	},

	limitField({ ...showFor, operation: ['getAll'] }),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showFor, operation: ['getAll'] } },
		options: [pageOption, labelSelectorOption],
	},
];
